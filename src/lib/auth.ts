import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import "@/types/session.types";
import { headers } from "next/headers";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

async function registrarAuditoria(
  idUsuario: number | null,
  accion: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "VIEW",
  detalleExtra?: string,
  ipAddress?: string
) {
  try {
    await prisma.auditoria.create({
      data: {
        idUsuario: idUsuario ?? undefined,
        accion,
        tablaAfectada: "usuario",
        registroId: idUsuario ?? undefined,
        ipAddress: ipAddress ?? null,
        fecha: new Date(),
      },
    });
  } catch {
    // Audit failure should never crash the auth flow
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // ── 1. Google OAuth ──────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── 2. Email + Contraseña ────────────────────────────────
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) throw new InvalidCredentialsError();

        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario || !usuario.passwordHash) {
          // Registrar login fallido (sin usuario conocido)
          await registrarAuditoria(null, "LOGIN", "Login fallido: usuario no encontrado");
          throw new InvalidCredentialsError();
        }

        if (usuario.estado === "inactivo") {
          await registrarAuditoria(usuario.id, "LOGIN", "Login fallido: cuenta inactiva");
          throw new CredentialsSignin("Cuenta desactivada. Contacta al administrador.");
        }

        const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordValido) {
          await registrarAuditoria(usuario.id, "LOGIN", "Login fallido: contraseña incorrecta");
          throw new InvalidCredentialsError();
        }

        // Login exitoso — actualizar último acceso y auditoría
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { ultimoAcceso: new Date() },
        });
        await registrarAuditoria(usuario.id, "LOGIN", "Login exitoso via credenciales");

        return {
          id: String(usuario.id),
          name: usuario.nombreUsuario,
          email: usuario.email,
          rol: usuario.rol,
          estado: usuario.estado,
        };
      },
    }),
  ],

  // ── Callbacks ──────────────────────────────────────────────
  callbacks: {
    async signIn({ user, account }) {
      // Google OAuth: verificar/crear usuario en nuestra tabla
      if (account?.provider === "google") {
        if (!user.email) return false;

        const usuarioExistente = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!usuarioExistente) {
          // SEGURIDAD: Solo se permite si el admin pre-autorizó el correo.
          // Si no está en la BD, se RECHAZA el acceso.
          await registrarAuditoria(null, "LOGIN", `Login rechazado Google: correo ${user.email} no autorizado`);
          return false;
        }

        if (usuarioExistente.estado === "inactivo") {
          await registrarAuditoria(usuarioExistente.id, "LOGIN", "Login fallido Google: cuenta inactiva");
          return false;
        }

        // Login exitoso por Google
        await prisma.usuario.update({
          where: { id: usuarioExistente.id },
          data: { ultimoAcceso: new Date() },
        });
        await registrarAuditoria(usuarioExistente.id, "LOGIN", "Login exitoso via Google OAuth");
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.rol = (user as any).rol;
        token.estado = (user as any).estado;
      }

      // Para Google OAuth: leer rol desde nuestra DB (no desde Google)
      if (account?.provider === "google" && token.email) {
        const usuario = await prisma.usuario.findUnique({
          where: { email: token.email },
        });
        if (usuario) {
          token.id = String(usuario.id);
          token.rol = usuario.rol;
          token.estado = usuario.estado;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
        session.user.estado = token.estado as string;
      }
      return session;
    },
  },

  events: {
    // Registrar cierre de sesión en auditoría
    async signOut({ token }: any) {
      if (token?.id) {
        await registrarAuditoria(Number(token.id), "LOGOUT", "Cierre de sesion");
      }
    },
  },

  // ── Páginas personalizadas ─────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ── Configuración de sesión ────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas (jornada laboral)
    updateAge: 60 * 60,  // Refrescar token cada hora de actividad
  },

  // ── Confiar en hosts ───────────────────────────────────────
  trustHost: true,
});
