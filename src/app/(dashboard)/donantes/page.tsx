import Link from "next/link";
import { Plus, Search, FileText, ChevronRight, UserCircle2 } from "lucide-react";
import { getDonantes } from "@/app/actions/donantes";
import { auth } from "@/lib/auth";
import { formatDateSafe } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DonantesPage(
  props: {
    searchParams: Promise<{ q?: string; page?: string; tab?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const q = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;
  const currentTab = searchParams.tab || "Todos";

  const { donantes, total, paginas } = await getDonantes(q, currentPage, 15, currentTab);

  const TABS = ["Todos", "Donantes Activos", "Donantes Elegibles", "Donantes No Elegibles", "Donantes Desactivados"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 anim-fade-up d1">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <UserCircle2 className="h-8 w-8 text-teal-500" />
            Directorio de Donantes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión integral de expedientes médicos y perfiles de donación. ({total} registrados)
          </p>
        </div>

        {session?.user?.rol !== "consulta" && (
          <Link
            href="/donantes/nuevo"
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Nuevo Donante
          </Link>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-border/50 flex">
        <form action="/donantes" className="flex-1 relative flex items-center h-12">
          {currentTab !== "Todos" && <input type="hidden" name="tab" value={currentTab} />}
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por código, nombre completo, o documento de identidad..."
            className="w-full h-full bg-transparent pl-12 pr-4 outline-none text-[15px] placeholder:text-muted-foreground"
          />
          <button type="submit" className="hidden">Buscar</button>
        </form>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`/donantes?tab=${tab}${q ? `&q=${q}` : ""}`}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentTab === tab 
                ? "bg-teal-600 text-white shadow-md shadow-teal-900/20" 
                : "bg-white text-muted-foreground hover:bg-muted border border-border/50"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {/* ── Listado Moderno ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
        {donantes.length === 0 ? (
          <div className="p-16 text-center">
            <UserCircle2 className="h-16 w-16 mx-auto text-muted/50 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">Ningún donante encontrado</h3>
            <p className="text-sm text-muted-foreground">Intenta con otros términos de búsqueda o registra uno nuevo.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {donantes.map((donante: any, i: number) => (
              <Link 
                key={donante.id} 
                href={`/donantes/${donante.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4"
              >
                {/* Info Principal */}
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-sm ${
                    donante.sexo === "MASCULINO" ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-rose-500 to-pink-600"
                  }`}>
                    {donante.nombres.charAt(0)}{donante.apellidos.charAt(0)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {donante.codigo}
                      </span>
                      {!donante.estado || donante.estado === "inactivo" && (
                         <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                           <span className="h-1 w-1 rounded-full bg-red-500" /> Inactivo
                         </span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-base group-hover:text-teal-600 transition-colors">
                      {donante.nombres} {donante.apellidos}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Identidad: {donante.documentoIdentidad || "N/D"} • {donante.municipio || "Sin ubicación"}
                    </p>
                  </div>
                </div>

                {/* Info Médica Resumen */}
                <div className="flex items-center gap-8 sm:pr-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Grupo Sang.</p>
                    <span className={`inline-flex items-center justify-center h-8 px-3 rounded-lg font-extrabold text-sm ${
                      !donante.grupoSanguineo?.grupo 
                        ? "bg-muted text-muted-foreground" 
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {donante.grupoSanguineo?.grupo || "SIN REGISTRO"}
                    </span>
                  </div>

                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Última Donación</p>
                    <p className="text-sm font-semibold">
                      {donante.fechaUltimaDonacion ? formatDateSafe(donante.fechaUltimaDonacion) : "Nunca ha donado"}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Paginación ── */}
      {paginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link 
            href={`/donantes?page=${currentPage - 1}${q ? `&q=${q}` : ""}&tab=${currentTab}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50 bg-muted/50 text-muted-foreground' : 'bg-white border border-border hover:bg-muted text-foreground'}`}
          >
            Anterior
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Página {currentPage} de {paginas}</span>
          <Link 
            href={`/donantes?page=${currentPage + 1}${q ? `&q=${q}` : ""}&tab=${currentTab}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage >= paginas ? 'pointer-events-none opacity-50 bg-muted/50 text-muted-foreground' : 'bg-white border border-border hover:bg-muted text-foreground'}`}
          >
            Siguiente
          </Link>
        </div>
      )}
    </div>
  );
}
