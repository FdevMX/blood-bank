"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, UserSquare2, Tags, Droplet } from "lucide-react";

export function CatalogosTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Enfermedades Recientes",
      href: "/catalogos/enfermedades",
      icon: HeartHandshake,
    },
    {
      label: "Tipos de Donante",
      href: "/catalogos/tipos-donante",
      icon: UserSquare2,
    },
    {
      label: "Grupos Sanguíneos",
      href: "/catalogos/grupos-sanguineos",
      icon: Droplet,
    },
    {
      label: "Clasificación Donación",
      href: "/catalogos/clasificaciones",
      icon: Tags,
    },
  ];

  return (
    <div className="flex overflow-x-auto border-b border-border/50 hide-scrollbar bg-white">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap outline-none
              ${
                isActive
                  ? "border-b-2 border-red-500 text-red-600 bg-red-50/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }
            `}
          >
            <tab.icon className={`h-4 w-4 ${isActive ? "text-red-500" : "opacity-60"}`} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
