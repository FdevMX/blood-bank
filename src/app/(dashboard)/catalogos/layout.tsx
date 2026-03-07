import Link from "next/link";
import { headers } from "next/headers";
import { HeartHandshake, Droplet, UserSquare2, Tags, Settings2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CatalogosTabs } from "./CatalogosTabs";

export default async function CatalogosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user || session.user.rol !== "administrador") {
    redirect("/dashboard");
  }

  // Obtenemos el path actual para marcar el tab activo (es un hack simple para server components)
  const headersList = await headers();
  const currentPath = headersList.get("x-invoke-path") || "";
  
  // Note: Un client component para Tabs sería más preciso, pero vamos a usar un layout wrapper genérico.
  // Vamos a usar un componente de cliente para los tabs para evitar problemas con layouts.

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header del módulo */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-red-500" />
            Catálogos del Sistema
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las listas de opciones que alimentan los formularios de la aplicación.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
        {/* Tabs - Se usa un client component para manejar el estado activo de forma limpia */}
        <CatalogosTabs />
        
        {/* Contenido */}
        <div className="p-6 bg-muted/10">
          {children}
        </div>
      </div>
    </div>
  );
}

 
