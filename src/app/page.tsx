import Link from "next/link";
import { ArrowRight, Shield, Droplets, Activity, Heart, Users, BarChart3, Clock, CheckCircle2, Lock, Github, Terminal, Layout, Database, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1210] text-white overflow-hidden selection:bg-red-500/30 font-sans">
      {/* ── Navbar ── */}
      <nav className="fixed w-full z-50 bg-[#1a1210]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">Banco de Sangre</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
            <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
            <a href="#proceso" className="hover:text-white transition-colors">Cómo Funciona</a>
            <a href="#equipo" className="hover:text-white transition-colors">Equipo</a>
            <a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/FdevMX/blood-bank" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm font-medium">Código Abierto</span>
            </a>
            <Link
              href="/login"
              className="rounded-full bg-white text-black hover:bg-gray-200 px-6 py-2.5 text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="inicio" className="relative max-w-7xl mx-auto px-6 pt-32 pb-32">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-0 w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[90px] pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto">
          <a href="https://github.com/FdevMX/blood-bank" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8 hover:bg-white/10 transition-colors cursor-pointer group animate-[fade-in-up_1s_ease-out]">
            <Github className="h-4 w-4 text-white/70 group-hover:text-white" />
            <span className="text-xs font-bold text-white/80 tracking-wider uppercase group-hover:text-white">Proyecto Open Source en GitHub</span>
            <ArrowRight className="h-3 w-3 text-white/50 group-hover:translate-x-1 transition-transform" />
          </a>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Gestión Inteligente para<br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent relative">
              Bancos de Sangre
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-red-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
            Simplificamos la administración de donantes, donaciones e inventario. 
            Una plataforma robusta, protegida bajo estándares OWASP y diseñada para salvar vidas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 text-[15px] font-bold shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] hover:-translate-y-1 transition-all"
            >
              Acceder al Sistema
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#caracteristicas"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 text-[15px] font-bold transition-all backdrop-blur-sm"
            >
              Descubrir Funciones
            </a>
          </div>
        </div>

        {/* Dashboard Preview Mockup (Animated) */}
        <div className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
          {/* Glowing Aura behind mockup */}
          <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="rounded-2xl border border-white/10 bg-[#221816]/90 backdrop-blur-2xl p-2 md:p-3 shadow-2xl relative overflow-hidden transform group-hover:rotate-x-2 group-hover:-translate-y-2 transition-transform duration-700 ease-out">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-orange-500 opacity-80" />
            
            {/* Mac Window Controls */}
            <div className="flex items-center gap-2 mb-3 px-3 pt-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white/5 text-[10px] text-white/30 font-mono tracking-widest hidden sm:flex">umanager.site/dashboard</div>
            </div>
            
            {/* Inner Dashboard View */}
            <div className="rounded-xl border border-white/5 bg-[#120c0b] aspect-[16/10] relative overflow-hidden flex shadow-inner">
              
              {/* Sidebar */}
              <div className="w-16 md:w-56 border-r border-white/5 bg-white/[0.02] flex flex-col p-4 gap-4">
                <div className="md:flex items-center gap-3 hidden px-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-red-500 animate-pulse" />
                  </div>
                  <div className="h-4 w-24 bg-white/10 rounded-full" />
                </div>
                {/* Menu Items */}
                <div className="flex flex-col gap-2">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-10 rounded-lg flex items-center px-3 gap-3 ${i===1 ? 'bg-red-500/10 border border-red-500/20' : 'hover:bg-white/5'} transition-colors relative overflow-hidden`}>
                      <div className={`h-4 w-4 rounded-sm ${i===1 ? 'bg-red-500' : 'bg-white/20'}`} />
                      <div className={`hidden md:block h-3 rounded-full ${i===1 ? 'bg-red-400/50 w-24' : 'bg-white/10 w-20'}`} />
                      {i===1 && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col relative">
                {/* Topbar */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01]">
                  <div className="h-5 w-32 bg-white/10 rounded-full" />
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-white/5 hidden sm:block" />
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 overflow-hidden flex items-center justify-center p-[2px]">
                      <div className="w-full h-full bg-[#120c0b] rounded-full" />
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Widgets */}
                <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(col => (
                      <div key={col} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group/card">
                        <div className="flex justify-between items-center">
                          <div className={`h-8 w-8 rounded-lg ${col===1 ? 'bg-red-500/20' : col===2 ? 'bg-blue-500/20' : col===3 ? 'bg-emerald-500/20' : 'bg-orange-500/20'} flex items-center justify-center`}>
                            <div className={`h-4 w-4 rounded-full ${col===1 ? 'bg-red-500' : col===2 ? 'bg-blue-500' : col===3 ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
                          </div>
                          <div className="h-4 w-12 bg-white/10 rounded-full" />
                        </div>
                        <div className="h-8 w-20 bg-white/20 rounded-md" />
                        
                        {/* Fake Sparkline Chart */}
                        <div className="absolute bottom-0 left-0 w-full h-8 opacity-20">
                          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                            <path d={`M0 20 L0 10 Q 25 ${col % 2 === 0 ? 0 : 20} 50 10 T 100 5 L100 20 Z`} fill={col===1 ? '#ef4444' : col===2 ? '#3b82f6' : col===3 ? '#10b981' : '#f97316'} />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts & Tables Area */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Big Chart */}
                    <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative">
                      <div className="flex justify-between items-center">
                        <div className="h-5 w-40 bg-white/10 rounded-full" />
                        <div className="h-6 w-24 bg-white/5 rounded-full" />
                      </div>
                      <div className="flex-1 border-b border-t border-white/5 flex items-end gap-2 pt-8 pb-2">
                        {/* Animated Bars */}
                        {[40, 70, 45, 90, 60, 30, 80, 50, 100, 65, 40, 75].map((h, i) => (
                          <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group/bar hover:bg-white/10 transition-colors" style={{ height: '100%' }}>
                            <div 
                              className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm transition-all duration-1000 ease-out" 
                              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Recent Activity List */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                      <div className="h-5 w-32 bg-white/10 rounded-full mb-2" />
                      {[1,2,3,4].map(item => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/5 shrink-0" />
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="h-3 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Divider ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-white/[0.05] lg:divide-x">
            {[
              { label: "Donantes Registrados", value: "10k+", icon: Users },
              { label: "Unidades en Inventario", value: "2.5k", icon: Activity },
              { label: "Hospitales Conectados", value: "15", icon: Shield },
              { label: "Vidas Salvadas", value: "30k+", icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center pt-4 lg:pt-0 group cursor-default">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/10 transition-all duration-300">
                  <stat.icon className="h-6 w-6 text-white/50 group-hover:text-red-400 transition-colors" />
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">{stat.value}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="caracteristicas" className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Todo lo que necesitas en<br />un solo lugar
          </h2>
          <p className="text-lg text-white/50">
            Herramientas avanzadas diseñadas específicamente para optimizar el flujo de trabajo en bancos de sangre y garantizar la seguridad del paciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "Gestión de Donantes",
              desc: "Registro detallado, historial médico, evaluaciones de elegibilidad y seguimiento de donaciones diferidas.",
              color: "from-blue-500/20 to-blue-600/5",
              iconColor: "text-blue-400"
            },
            {
              icon: Activity,
              title: "Trazabilidad de Unidades",
              desc: "Inventario en tiempo real. Códigos únicos, control de temperatura, fechas de vencimiento y estado.",
              color: "from-emerald-500/20 to-emerald-600/5",
              iconColor: "text-emerald-400"
            },
            {
              icon: BarChart3,
              title: "Reportes Estadísticos",
              desc: "Métricas cruciales al instante, desde donaciones por periodo hasta desglose de grupos sanguíneos.",
              color: "from-purple-500/20 to-purple-600/5",
              iconColor: "text-purple-400"
            },
            {
              icon: Heart,
              title: "Evaluación Médica",
              desc: "Cuestionarios parametrizados y registro de signos vitales (presión, hemoglobina, peso) pre-donación.",
              color: "from-red-500/20 to-red-600/5",
              iconColor: "text-red-400"
            },
            {
              icon: Clock,
              title: "Alertas Tempranas",
              desc: "Notificaciones automáticas sobre unidades próximas a caducar o bajo stock de grupos críticos.",
              color: "from-orange-500/20 to-orange-600/5",
              iconColor: "text-orange-400"
            },
            {
              icon: Shield,
              title: "Auditoría Continua",
              desc: "Registro de cada acción realizada en el sistema con IP y usuario para cumplimiento normativo.",
              color: "from-sky-500/20 to-sky-600/5",
              iconColor: "text-sky-400"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-3xl bg-[#221816]/50 border border-white/[0.05] p-8 hover:bg-[#2a1d1a] transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${feature.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 border border-white/5 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm relative z-10">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process Section ── */}
      <section id="proceso" className="border-t border-white/[0.05] relative overflow-hidden bg-gradient-to-b from-transparent to-white/[0.01]">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-6">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Flujo de Trabajo</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-12">
                Simplicidad y Seguridad<br />en cada etapa
              </h2>
              <div className="space-y-10">
                {[
                  { step: "01", title: "Admisión del Donante", desc: "Registro rápido validando identificación y buscando en el historial de diferimientos." },
                  { step: "02", title: "Evaluación Clínica", desc: "Toma de signos vitales, prueba de hemoglobina y entrevista médica confidencial." },
                  { step: "03", title: "Extracción Segura", desc: "Registro de la donación generando códigos de barras únicos para la bolsa y tubos." },
                  { step: "04", title: "Liberación al Inventario", desc: "Validación de pruebas serológicas antes de marcar la unidad como 'Disponible'." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 relative group">
                    {i !== 3 && <div className="absolute top-14 left-[23px] w-[2px] h-[calc(100%+8px)] bg-gradient-to-b from-red-500/50 to-white/5 group-hover:from-red-500 group-hover:to-red-500/50 transition-colors" />}
                    <div className="relative z-10 flex-shrink-0 h-12 w-12 rounded-full bg-[#1a1210] border-2 border-red-500/30 flex items-center justify-center font-black text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-red-300 transition-colors">{item.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Interactive Floating Elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] rounded-3xl" />
              
              <div className="relative z-10 w-full max-w-md">
                {/* Floating Card 1 */}
                <div className="absolute -top-20 -left-10 bg-[#221816]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl animate-[float_6s_ease-in-out_infinite] shadow-2xl z-20 w-64">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="font-bold text-sm">Donante Apto</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">A+</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full w-full" />
                    <div className="h-2 bg-white/10 rounded-full w-3/4" />
                  </div>
                </div>
                
                {/* Center Main Element */}
                <div className="bg-gradient-to-br from-[#2a1d1a] to-[#1a1210] border top border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 w-full aspect-square flex flex-col items-center justify-center animate-[float_8s_ease-in-out_infinite_reverse]">
                  <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-2xl" />
                  <div className="h-32 w-32 rounded-full bg-red-500/10 flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                     <Droplets className="h-16 w-16 text-red-500" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">Unidad Colectada</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Registrada con éxito
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-10 -right-10 bg-[#221816]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl animate-[float_7s_ease-in-out_infinite_1s] shadow-2xl z-20 w-72">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="h-4 w-4 text-orange-400" />
                    <span className="font-bold text-sm">Validación Serológica</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <div className="flex-1 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                       <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-white/40 text-right uppercase tracking-wider font-bold">En proceso...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section (Creadores) ── */}
      <section id="equipo" className="border-t border-white/[0.05] bg-[#160f0d] relative overflow-hidden z-20">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-6">
            <Code className="h-4 w-4 text-red-400" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Creadores</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            El Equipo Detrás del Código
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-20">
            Somos desarrolladores apasionados por crear soluciones tecnológicas de impacto para el sector salud.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {/* Developer 1 */}
            <div className="group flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 cursor-pointer">
                {/* Animated Avatar 1 */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-900 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] flex items-center justify-center overflow-hidden transform group-hover:-rotate-3">
                   <Database className="h-10 w-10 text-blue-200/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyIi8+PHBvbHlnb24gcG9pbnRzPSIyIDE3IDEyIDIyIDIyIDE3Ii8+PHBvbHlnb24gcG9pbnRzPSIyIDEyIDEyIDE3IDIyIDEyIi8+PC9zdmc+')] bg-center bg-no-repeat bg-[length:60%] opacity-50 group-hover:rotate-12 transition-transform duration-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Gabriel Hassan B.</h3>
              <p className="text-sm font-semibold text-blue-400 mb-3 tracking-wide">Fullstack Developer</p>
              <div className="flex gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">Next.js</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">PostgreSQL</span>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="group flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 cursor-pointer">
                {/* Animated Avatar 2 */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-pink-500 to-orange-600 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] flex items-center justify-center overflow-hidden transform group-hover:rotate-3">
                   <Layout className="h-10 w-10 text-pink-200/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yIDEyaDIwIi8+PHBhdGggZD0iTTIwIDEydjhhMiAyIDAgMCAxLTIgMnYwYTIgMiAwIDAgMS0yLTJ2LTgiLz48cGF0aCBkPSJNOSAxMnY4YTIgMiAwIDAgMS0yIDJ2MGEyIDIgMCAwIDEtMi0ydi04Ii8+PHBhdGggZD0iTTIgMTBWOWEyIDIgMCAwIDEgMi0yaDE2YTIgMiAwIDAgMSAyIDJ2MSIvPjwvc3ZnPg==')] bg-center bg-no-repeat bg-[length:60%] opacity-50 group-hover:-rotate-12 transition-transform duration-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Ana Gabriela C.</h3>
              <p className="text-sm font-semibold text-pink-400 mb-3 tracking-wide">Frontend Developer</p>
              <div className="flex gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">UI/UX</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">TailwindCSS</span>
              </div>
            </div>

            {/* Developer 3 */}
            <div className="group flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 cursor-pointer">
                {/* Animated Avatar 3 */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-900 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center overflow-hidden transform group-hover:-rotate-3">
                   <Terminal className="h-10 w-10 text-emerald-200/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iNCAxNyAxMCAxMSA0IDUiLz48bGluZSB4MT0iMTIiIHkxPSIxOSIgeDI9IjIwIiB5Mj0iMTkiLz48L3N2Zz4=')] bg-center bg-no-repeat bg-[length:50%] opacity-50 group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Alfredo L.</h3>
              <p className="text-sm font-semibold text-emerald-400 mb-3 tracking-wide">Fullstack Developer</p>
              <div className="flex gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">Backend</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">Prisma ORM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Security & Compliance Section ── */}
      <section id="seguridad" className="border-t border-white/[0.05] bg-[#221816]/30">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
            <Lock className="h-10 w-10 text-white/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Seguridad y Cumplimiento
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-16">
            La información clínica es crítica. Nuestro sistema está diseñado siguiendo estrictos estándares de seguridad informática y normativas de salud.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl bg-[#1a1210] border border-white/5 hover:border-white/20 hover:bg-[#2a1d1a] transition-all duration-300">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-5" />
              <h4 className="text-xl font-bold mb-3">Autenticación Segura</h4>
              <p className="text-sm text-white/50 leading-relaxed">Integración con Google OAuth 2.0 y contraseñas encriptadas con algoritmos bcrypt robustos.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#1a1210] border border-white/5 hover:border-white/20 hover:bg-[#2a1d1a] transition-all duration-300">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-5" />
              <h4 className="text-xl font-bold mb-3">Control por Roles</h4>
              <p className="text-sm text-white/50 leading-relaxed">Privilegios granulares para Administradores, Operadores y personal de Consulta médica.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#1a1210] border border-white/5 hover:border-white/20 hover:bg-[#2a1d1a] transition-all duration-300">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-5" />
              <h4 className="text-xl font-bold mb-3">Registro de Auditoría</h4>
              <p className="text-sm text-white/50 leading-relaxed">Trazabilidad total. Cada vista, edición o inicio de sesión queda registrado permanentemente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-[100%] bg-red-600/20 blur-[150px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 py-40 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-2xl">
            Comienza a salvar vidas<br />de manera eficiente
          </h2>
          <p className="text-xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Ingresa al portal administrativo y toma el control total de tu banco de sangre.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 rounded-full bg-white text-black px-10 py-5 text-lg font-bold shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300"
            >
              Iniciar Sesión Ahora
              <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/10 pb-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Banco de Sangre</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-white/50">
              <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
              <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
              <a href="#equipo" className="hover:text-white transition-colors">Equipo</a>
              <a href="https://github.com/FdevMX/blood-bank" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30 text-center md:text-left">
              © {new Date().getFullYear()} Banco de Sangre. Desarrollo Open Source.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>Construido con</span>
              <Heart className="h-4 w-4 text-red-500/50" />
              <span>para salvar vidas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
