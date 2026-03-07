import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas que NO requieren autenticación
const publicRoutes = ["/login", "/api/auth"];

// Rutas exclusivas del administrador
const adminOnlyRoutes = ["/admin", "/catalogos", "/usuarios", "/auditoria"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) return NextResponse.next();

  // Verificar sesión
  const session = await auth();

  // Sin sesión → redirigir a login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cuenta inactiva → bloquear
  if (session.user?.estado === "inactivo") {
    return NextResponse.redirect(new URL("/login?error=AccountInactive", request.url));
  }

  // Control de acceso por rol para rutas de administrador
  const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && session.user?.rol !== "administrador") {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
