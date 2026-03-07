"use client";

import { Search, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function LiveSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultValue = searchParams.get("q")?.toString() ?? "";
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sincronizar estado si la URL cambia (ej. navegacion hacia atras)
  useEffect(() => {
    setValue(searchParams.get("q")?.toString() ?? "");
  }, [searchParams]);

  const updateUrl = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
        params.set("q", val);
    } else {
        params.delete("q");
    }
    params.delete("page"); // Reset a page 1 en nueva busqueda
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleChange = (val: string) => {
    setValue(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
        updateUrl(val);
    }, 400); // 400ms de debounce
  };

  const handleClear = () => {
    setValue("");
    updateUrl("");
  };

  return (
    <div className="flex-1 relative flex items-center h-12 w-full">
      <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent pl-12 pr-28 outline-none text-[13px] sm:text-[15px] placeholder:text-muted-foreground transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-2 sm:right-3 h-8 px-3 sm:px-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-rose-600 hover:bg-rose-100 shadow-sm transition-all"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
