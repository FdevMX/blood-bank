import { getUsuarios } from "@/app/actions/usuarios";
import { UsuariosTable } from "@/components/usuarios/UsuariosTable";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await auth();
  if (session?.user?.rol !== "administrador") {
    redirect("/dashboard");
  }

  const usuarios = await getUsuarios();

  return (
    <div className="max-w-7xl mx-auto space-y-8 anim-fade-up d1">
      {/* Header and Hero Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1210] to-[#2d1a14] p-8 md:p-10 shadow-xl relative text-white">
        <div className="absolute top-0 right-0 h-64 w-64 bg-red-600/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-red-500" />
            Acceso y Operadores
          </h1>
          <p className="text-white/60 mt-2 text-sm sm:text-base max-w-lg leading-relaxed">
            Administra los roles, invita a nuevos biomédicos o desactiva credenciales del personal dado de baja. Los cambios de permisos actúan inmediatamente.
          </p>
        </div>
        <div className="relative z-10 shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center">
            <span className="text-3xl font-black text-rose-400 tabular-nums">{usuarios.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">Colaboradores</span>
        </div>
      </div>

      <UsuariosTable initialUsers={usuarios} />
    </div>
  );
}
