"use client";

export function DashboardSection() {
  return (
    <section className="border-b-4 border-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Description */}
        <div className="lg:col-span-4 p-12 border-r-0 lg:border-r-4 border-white bg-black">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-landing-headline">
            CONTROL TOTAL EN UNA <span className="text-[#ef4444]">INTERFAZ INTUITIVA</span>
          </h2>
          <p className="font-landing-body text-white/70 mb-12 text-sm leading-relaxed">
            NUESTRA CONSOLA DE ADMINISTRACIÓN CENTRALIZA LOS DATOS MÁS CRÍTICOS, PERMITIENDO A LOS COORDINADORES DE BANCOS DE SANGRE TOMAR DECISIONES EN SEGUNDOS.
          </p>
          <div className="space-y-8">
            <div className="flex gap-4 border-l-4 border-[#ef4444] pl-6">
              <div>
                <span className="font-bold text-xl block font-landing-headline">ALERTAS PREDICTIVAS</span>
                <span className="text-xs font-landing-body text-white/50">
                  SISTEMA QUE ANTICIPA ESCASEZ DE GRUPOS SANGUÍNEOS ESPECÍFICOS.
                </span>
              </div>
            </div>
            <div className="flex gap-4 border-l-4 border-white pl-6">
              <div>
                <span className="font-bold text-xl block font-landing-headline">MULTI-CENTRO SYNC</span>
                <span className="text-xs font-landing-body text-white/50">
                  VISUALIZACIÓN GLOBAL DE MÚLTIPLES BANCOS Y HOSPITALES.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Terminal Console */}
        <div className="lg:col-span-8 bg-[#1A1A1A] p-8 lg:p-16">
          <div className="bg-black border-2 border-white p-2">
            <div className="border border-white/20 p-6 min-h-[400px] font-landing-body text-xs">
              {/* Terminal Tabs */}
              <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
                <div className="flex gap-4">
                  <div className="px-3 py-1 bg-white text-black font-bold">TERMINAL_01</div>
                  <div className="px-3 py-1 border border-[#333] text-white/50">LOG_STREAM</div>
                </div>
                <div className="text-[#ef4444]">
                  {new Date().toLocaleDateString("es-MX")} // {new Date().toLocaleTimeString("es-MX")}
                </div>
              </div>

              {/* Log Entries */}
              <div className="space-y-1">
                <div className="p-3 bg-[#ef4444]/10 border-l-4 border-[#ef4444] flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-[#ef4444]">[O-]</span>
                    <span>DONACIÓN #BH-9902 &gt; PROCESANDO LAB. CENTRAL</span>
                  </div>
                  <span className="font-bold">[ESTABLE]</span>
                </div>
                <div className="p-3 bg-red-900/20 border-l-4 border-red-500 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-red-500">[A+]</span>
                    <span>SOLICITUD URGENTE: HOSPITAL SAN JUAN &gt; TRÁNSITO: 12 MIN</span>
                  </div>
                  <span className="font-bold text-red-500">[URGENTE]</span>
                </div>
                <div className="p-3 border-l-4 border-white/20 flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-6">
                    <span className="font-bold">[B-]</span>
                    <span>DONACIÓN #BH-9891 &gt; ALMACENADO - ESTANTE B2</span>
                  </div>
                  <span>[STOCK]</span>
                </div>
              </div>

              {/* Chart */}
              <div className="mt-12 pt-12 border-t border-[#333]">
                <div className="text-[10px] text-white/30 mb-4">DATA_VISUALIZATION: STOCK_VITALIDAD</div>
                <div className="flex items-end gap-2 h-24">
                  <div className="flex-1 bg-[#ef4444]/40 h-[40%] border border-[#ef4444]/60" />
                  <div className="flex-1 bg-[#ef4444] h-[80%] border border-[#ef4444]" />
                  <div className="flex-1 bg-[#ef4444]/40 h-[65%] border border-[#ef4444]/60" />
                  <div className="flex-1 bg-white h-[95%] border border-white animate-pulse" />
                  <div className="flex-1 bg-[#ef4444]/40 h-[50%] border border-[#ef4444]/60" />
                  <div className="flex-1 bg-[#ef4444]/20 h-[30%] border border-[#ef4444]/40" />
                  <div className="flex-1 bg-[#ef4444]/60 h-[70%] border border-[#ef4444]/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
