"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Droplets, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

// Componente interno que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Captura y muestra errores de OAuth, luego limpia la URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      // Mapea el error a un mensaje legible
      const errorMessages: Record<string, string> = {
        AccessDenied: "Acceso denegado. Tu cuenta no está autorizada o está inactiva.",
        NotAuthorized: "Usuario no autorizado. El correo electrónico no está registrado en el sistema.",
        OAuthAccountNotLinked: "Este correo ya está registrado con otro método de autenticación.",
        OAuthCallback: "Error en la autenticación. Por favor, intenta nuevamente.",
        Default: "Error de autenticación. Por favor, intenta nuevamente.",
      };
      
      setError(errorMessages[errorParam] || errorMessages.Default);

      // Elimina el parámetro de error de la URL sin recargar la página
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, "", newUrl.pathname + newUrl.search);
    }
  }, [searchParams]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push(callbackUrl);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex bg-[#1a1210]">
      {/* ── Left Panel: Decorative ── */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-[#1a1210] to-[#0f0a08]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-600/10 blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-[200px] h-[200px] rounded-full bg-red-500/5 blur-[60px]" />

        <div className="relative text-center px-12 anim-fade-up">
          <div className="inline-flex h-20 w-20 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 items-center justify-center shadow-2xl shadow-red-900/50 mb-8 anim-float">
            <Droplets className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Banco de<br />Sangre
          </h2>
          <p className="mt-4 text-white/30 text-sm max-w-xs mx-auto">
            Sistema de gestión integral para la administración de donantes, donaciones e inventario de sangre.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-1.5 w-8 rounded-full bg-red-500" />
            <div className="h-1.5 w-3 rounded-full bg-white/10" />
            <div className="h-1.5 w-3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-sm anim-fade-up d2">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Banco de Sangre</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight">Inicia Sesión</h1>
            <p className="text-sm text-muted-foreground mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700 mb-6 anim-scale">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white border border-border px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">o con tu cuenta</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold mb-1.5 block">Correo electrónico</label>
              <input
                id="email" type="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@hospital.com"
                disabled={loading || googleLoading}
                className="w-full rounded-xl bg-muted/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-red-500/30 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold mb-1.5 block">Contraseña</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                  required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || googleLoading}
                  className="w-full rounded-xl bg-muted/50 px-4 py-3 pr-11 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-red-500/30 focus:bg-white transition-all disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verificando...</> : "Ingresar al Sistema"}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-muted-foreground leading-relaxed">
            Acceso restringido a personal autorizado.<br />
            Sistema protegido bajo estándares OWASP.
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente wrapper con Suspense para useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1a1210]">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
