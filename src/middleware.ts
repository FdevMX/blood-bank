import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Rutas públicas que NO requieren autenticación
const publicRoutes = ["/login", "/api/auth"];

// Rutas exclusivas del administrador
const adminOnlyRoutes = ["/admin", "/catalogos", "/usuarios", "/auditoria"];

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Permitir rutas públicas exactas (landing page)
  if (pathname === "/") return NextResponse.next();

  // Permitir otras rutas públicas por prefijo
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) return NextResponse.next();

  // Redirigir si no hay sesión
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const token = req.auth.user as any;

  // Cuenta inactiva → bloquear
  if (token.estado === "inactivo") {
    return NextResponse.redirect(new URL("/login?error=AccountInactive", req.url));
  }

  // Control de acceso por rol para rutas de administrador
  const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && token.rol !== "administrador") {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
