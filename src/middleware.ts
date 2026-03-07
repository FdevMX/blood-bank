import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas públicas que NO requieren autenticación
const publicRoutes = ["/login", "/api/auth"];

// Rutas exclusivas del administrador
const adminOnlyRoutes = ["/admin", "/catalogos", "/usuarios", "/auditoria"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) return NextResponse.next();

  // Verificar sesión con JWT directamente (bypass prisma y bcrypt en el Edge Runtime)
  // Utiliza el process.env.AUTH_SECRET por defecto de NextAuth v5
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET 
  });

  // Sin sesión → redirigir a login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cuenta inactiva → bloquear
  if (token.estado === "inactivo") {
    return NextResponse.redirect(new URL("/login?error=AccountInactive", request.url));
  }

  // Control de acceso por rol para rutas de administrador
  const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && token.rol !== "administrador") {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
