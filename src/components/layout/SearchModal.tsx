"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Droplets, ArrowRight, Loader2, X } from "lucide-react";
import { busquedaGlobal, type SearchResult } from "@/app/actions/search";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function ResultIcon({ tipo }: { tipo: SearchResult["tipo"] }) {
  if (tipo === "donante")
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
        <User className="h-4 w-4" />
      </span>
    );
  if (tipo === "donacion")
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
        <Droplets className="h-4 w-4" />
      </span>
    );
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-400">
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  // Debounced search
  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setSelected(0);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await busquedaGlobal(value);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[selected];
        if (item) {
          router.push(item.href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, selected, onClose, router]);

  // Scroll selected item into view
  useEffect(() => {
    const item = listRef.current?.children[selected] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const grouped = {
    donante: results.filter((r) => r.tipo === "donante"),
    donacion: results.filter((r) => r.tipo === "donacion"),
    acceso: results.filter((r) => r.tipo === "acceso"),
  };

  const groupLabels: Record<string, string> = {
    donante: "Donantes",
    donacion: "Donaciones",
    acceso: "Accesos rápidos",
  };

  // Build ordered flat index matching `results` order for keyboard selection
  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#120b0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Búsqueda global"
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Buscar donante, donación, módulo..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-500" />}
          {!loading && query && (
            <button
              onClick={() => handleChange("")}
              className="h-6 w-6 shrink-0 rounded-md flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 shrink-0 items-center rounded-md border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto py-2"
            role="listbox"
          >
            {(["donante", "donacion", "acceso"] as const).map((tipo) => {
              const group = grouped[tipo];
              if (group.length === 0) return null;

              return (
                <li key={tipo}>
                  <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 first:pt-1">
                    {groupLabels[tipo]}
                  </p>
                  <ul>
                    {group.map((item) => {
                      const globalIndex = results.findIndex((r) => r.id === item.id);
                      const isActive = globalIndex === selected;

                      return (
                        <li key={item.id} role="option" aria-selected={isActive}>
                          <button
                            className={`flex w-full items-center gap-3 px-3 py-2 mx-1 rounded-xl transition-colors text-left ${
                              isActive
                                ? "bg-red-500/10 text-white"
                                : "text-zinc-300 hover:bg-white/4 hover:text-white"
                            }`}
                            style={{ width: "calc(100% - 8px)" }}
                            onClick={() => handleNavigate(item.href)}
                            onMouseEnter={() => setSelected(globalIndex)}
                          >
                            <ResultIcon tipo={item.tipo} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium leading-tight">
                                {item.titulo}
                              </span>
                              <span className="block truncate text-[11px] text-zinc-500 leading-tight mt-0.5">
                                {item.subtitulo}
                              </span>
                            </span>
                            {item.extra && (
                              <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wide">
                                {item.extra}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state — only show when query has 2+ chars and not loading */}
        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Search className="h-8 w-8 text-zinc-700" />
            <p className="text-sm text-zinc-500">
              Sin resultados para{" "}
              <span className="font-medium text-zinc-400">&ldquo;{query}&rdquo;</span>
            </p>
          </div>
        )}

        {/* Hint bar */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2">
          <div className="flex items-center gap-3 text-[11px] text-zinc-600">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px]">↑</kbd>
              <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px]">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px]">↵</kbd>
              abrir
            </span>
          </div>
          <span className="text-[11px] text-zinc-700">Banco de Sangre</span>
        </div>
      </div>
    </div>
  );
}
