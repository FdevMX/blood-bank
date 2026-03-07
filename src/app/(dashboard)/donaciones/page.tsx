import Link from "next/link";
import { Plus, Search, Droplets, TestTube, Target, FlaskConical } from "lucide-react";
import { getDonaciones, actualizarEstadoDonacion } from "@/app/actions/donaciones";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { formatDateSafe } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DonacionesPage(props: {
  searchParams: Promise<{ q?: string; page?: string; tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const q = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;
  const currentTab = searchParams.tab || "Todos";

  const { donaciones, total, paginas } = await getDonaciones(q, currentPage, 15, currentTab);

  const TABS = ["Todos", "Donaciones Disponibles", "Donaciones Utilizadas", "Donaciones Descartadas", "Donaciones Vencidas"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 anim-fade-up d1">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FlaskConical className="h-8 w-8 text-rose-500" />
            Inventario y Recolección
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de unidades sanguíneas extraídas, estados (disponible, vencida, descartada) y fraccionamiento. ({total} unidades)
          </p>
        </div>

        {session?.user?.rol !== "consulta" && (
          <Link
            href="/donaciones/nueva"
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Registrar Extracción
          </Link>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-border/50 flex">
        <form action="/donaciones" className="flex-1 relative flex items-center h-12">
          {currentTab !== "Todos" && <input type="hidden" name="tab" value={currentTab} />}
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por código de unidad (UN-...), o nombre del donante..."
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
            href={`/donaciones?tab=${tab}${q ? `&q=${q}` : ""}`}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentTab === tab 
                ? "bg-rose-600 text-white shadow-md shadow-rose-900/20" 
                : "bg-white text-muted-foreground hover:bg-muted border border-border/50"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {/* ── Listado Moderno ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
        {donaciones.length === 0 ? (
          <div className="p-16 text-center">
            <Droplets className="h-16 w-16 mx-auto text-muted/50 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">Ninguna donación registrada</h3>
            <p className="text-sm text-muted-foreground">Inicia una nueva recolección de donante para poder visualizarla aquí.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {donaciones.map((donacion: any) => (
              <div 
                key={donacion.id} 
                className="group flex flex-col xl:flex-row xl:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-5"
              >
                {/* Info Principal de la Unidad */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden bg-white border`}>
                     <div className={`absolute bottom-0 left-0 right-0 opacity-20 ${
                        donacion.estado === 'disponible' ? 'bg-emerald-500' :
                        donacion.estado === 'utilizada' ? 'bg-blue-500' : 'bg-red-500'
                     }`} style={{ height: '60%' }} />
                     <Droplets className={`h-6 w-6 relative z-10 ${
                        donacion.estado === 'disponible' ? 'text-emerald-500' :
                        donacion.estado === 'utilizada' ? 'text-blue-500' : 'text-red-500'
                     }`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1 border-b border-dashed pb-1">
                      <span className="text-xs font-black uppercase tracking-widest text-[#1a1210]">
                        {donacion.codigo}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {Number(donacion.cantidadMl)} mL
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-rose-600 transition-colors">
                        Extraído de: <Link href={`/donantes/${donacion.idDonante}`} className="hover:underline text-teal-600">{donacion.donante.nombres} {donacion.donante.apellidos}</Link> 
                        <span className="text-xs text-muted-foreground"> (ID: {donacion.donante.codigo})</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Médica y Vencimiento */}
                <div className="flex items-center gap-5 xl:gap-8 xl:pr-4 flex-wrap">
                  
                  <div className="text-left w-24">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Sangre</p>
                    <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg font-black text-sm text-white bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] shadow-md shadow-red-900/20">
                      {donacion.grupoSanguineo?.grupo || "S/R"}
                    </span>
                  </div>

                  <div className="text-left w-32 border-l pl-4 border-dashed border-border/60">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Recolección</p>
                    <p className="text-sm font-semibold">{formatDateSafe(donacion.fecha)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(donacion.hora).toLocaleTimeString("es-HN", { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="text-left w-32 border-l pl-4 border-dashed border-border/60">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Vencimiento</p>
                    <p className={`text-sm font-semibold ${donacion.estado === 'vencida' ? 'text-red-600' : 'text-foreground'}`}>
                      {donacion.fechaVencimiento ? formatDateSafe(donacion.fechaVencimiento) : "N/D"}
                    </p>
                    <p className="text-xs text-muted-foreground">{donacion.clasificacion?.nombre || "Sin clasificar"}</p>
                  </div>

                  {/* Etiqueta de Estado y Acciones Rápidas */}
                  <div className="text-right w-36 flex flex-col items-end border-l pl-4 border-dashed border-border/60 ml-auto xl:ml-0 gap-2">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-[11px] font-black uppercase rounded-lg shadow-sm border ${
                      donacion.estado === "disponible" ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-900/10" :
                      donacion.estado === "utilizada" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-red-50 text-red-700 border-red-200 shadow-red-900/10"
                    }`}>
                      {donacion.estado === "disponible" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 anim-pulse-dot" />}
                      {donacion.estado}
                    </span>
                    
                    <div className="flex flex-col items-end gap-1">
                      <Link href={`/donaciones/${donacion.id}`} className="text-[10px] font-bold text-teal-600 hover:text-teal-800 underline transition-colors">
                        Ver Detalles Clínicos
                      </Link>

                      {session?.user?.rol !== "consulta" && donacion.estado === "disponible" && (
                        <form action={async () => { 
                          "use server"; 
                          await actualizarEstadoDonacion(donacion.id, "descartada", "Descartada por operador desde listado rápido."); 
                        }}>
                          <button className="text-[10px] font-bold text-muted-foreground hover:text-red-600 underline transition-colors mt-1">
                            Marcar Descartada
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Paginación ── */}
      {paginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link 
            href={`/donaciones?page=${currentPage - 1}${q ? `&q=${q}` : ""}&tab=${currentTab}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50 bg-muted/50 text-muted-foreground' : 'bg-white border border-border hover:bg-muted text-foreground'}`}
          >
            Anterior
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Página {currentPage} de {paginas}</span>
          <Link 
            href={`/donaciones?page=${currentPage + 1}${q ? `&q=${q}` : ""}&tab=${currentTab}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage >= paginas ? 'pointer-events-none opacity-50 bg-muted/50 text-muted-foreground' : 'bg-white border border-border hover:bg-muted text-foreground'}`}
          >
            Siguiente
          </Link>
        </div>
      )}
    </div>
  );
}
