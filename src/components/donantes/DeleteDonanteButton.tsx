"use client";

import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { eliminarDonanteDefinitivo } from "@/app/actions/donantes";
import { useRouter } from "next/navigation";

export function DeleteDonanteButton({ id, nombre }: { id: number; nombre: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const resp = await eliminarDonanteDefinitivo(id);
    if (resp?.error) {
      setError(resp.error);
      setIsDeleting(false);
      setConfirming(false);
    } else {
      router.push("/donantes");
    }
  };

  if (!confirming) {
    return (
      <button 
        onClick={() => setConfirming(true)}
        className="w-full sm:w-auto px-5 py-2 text-sm font-bold bg-muted hover:bg-rose-50 border border-transparent hover:border-rose-200 hover:text-rose-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        title="Eliminar Expediente Físicamente"
      >
        <Trash2 className="h-4 w-4" /> Eliminar
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl anim-scale">
        <AlertCircle className="h-10 w-10 text-rose-600 mb-4" />
        <h3 className="text-xl font-bold text-foreground">¿Eliminar Permanentemente?</h3>
        <p className="text-sm mt-2 font-medium text-muted-foreground">
          Estás a punto de destruir el expediente de <strong>{nombre}</strong>. Esta acción destruirá todos los historiales médicos y de elegibilidad conectados a esta persona. ¿Deseas continuar?
        </p>
        {error && (
           <p className="mt-4 text-xs font-bold text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
             {error}
           </p>
        )}
        <div className="mt-6 flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={() => { setConfirming(false); setError(null); }}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancelar Regreso
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 text-white shadow-lg hover:bg-rose-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? "Destruyendo..." : "Sí, Eliminar de Todo"}
          </button>
        </div>
      </div>
    </div>
  );
}
