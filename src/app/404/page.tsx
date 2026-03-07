import Link from "next/link";
import { SearchX, ChevronLeft, Droplets, Home } from "lucide-react";

export const metadata = {
  title: "Pagina no encontrada | Banco de Sangre",
  description: "La ruta solicitada no existe o no esta disponible para tu rol.",
};

export default function NotFoundRoutePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[560px] h-[560px] bg-red-600/4 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-amber-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-2xl text-center anim-fade-up">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/20">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black text-foreground tracking-tight">Banco de Sangre</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-black uppercase tracking-widest mb-7">
          Error 404 - Ruta no encontrada
        </div>

        <div className="flex justify-center mb-8">
          <div className="h-32 w-32 rounded-[38px] bg-red-50 border border-red-100 flex items-center justify-center shadow-xl shadow-red-100">
            <SearchX className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
          Este apartado no esta disponible
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-10">
          La ruta que intentaste abrir no existe o no esta habilitada para tu rol actual.
          Si necesitas acceso a este modulo, solicita autorizacion al administrador.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white text-sm font-bold hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border bg-card text-sm font-semibold hover:bg-muted/60 transition-all"
          >
            <Home className="h-4 w-4" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
