"use client";

export function StatsSection() {
  const stats = [
    { label: "DONANTES REGISTRADOS", value: "10,245", extra: "[ +12% ESTE MES ]", extraColor: "text-[#ef4444]" },
    { label: "UNIDADES EN INVENTARIO", value: "2,850", extra: "[ VERIFICADAS 24H ]", extraColor: "text-white" },
    { label: "HOSPITALES CONECTADOS", value: "15", extra: "[ RED ACTIVA ]", extraColor: "text-white/50" },
  ];

  return (
    <section className="border-b-4 border-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="p-10 border-r-2 border-b-2 md:border-b-0 border-white">
            <div className="text-white/50 text-xs font-landing-body mb-4 flex items-center">
              <span className="w-2 h-2 bg-white mr-2" /> {s.label}
            </div>
            <div className="text-6xl lg:text-7xl font-landing-headline font-bold mb-4">
              {s.value}
            </div>
            <div className={`${s.extraColor} text-xs font-landing-body font-bold`}>
              {s.extra}
            </div>
          </div>
        ))}
        <div className="p-10 bg-[#ef4444] text-black">
          <div className="text-black/70 text-xs font-landing-body mb-4 flex items-center font-bold">
            <span className="w-2 h-2 bg-black mr-2 animate-pulse" /> ACTIVIDAD EN TIEMPO REAL
          </div>
          <div className="text-7xl font-landing-headline font-bold mb-4">LIVE</div>
          <div className="text-black text-xs font-landing-body font-bold uppercase">
            [ MONITORIZACIÓN ACTIVA ]
          </div>
        </div>
      </div>
    </section>
  );
}
