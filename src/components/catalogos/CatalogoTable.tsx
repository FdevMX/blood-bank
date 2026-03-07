"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Check,
  X,
  Loader2,
  AlertCircle,
  Search,
  Trash2,
} from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isLoading: boolean;
}

function DeleteDialog({ isOpen, onClose, onConfirm, title, description, itemName, isLoading }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 anim-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 anim-scale">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-sm">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 mb-0" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estás a punto de destruir el registro de <span className="font-bold text-foreground">"{itemName}"</span>. 
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted transition-all"
            >
              Cancelar Regreso
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-[#ef4444] hover:bg-red-700 shadow-xl shadow-red-900/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sí, Eliminar de Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CatalogItem {
  id: number;
  nombre?: string;
  grupo?: string;
  descripcion: string | null;
  activo: boolean;
  _count?: Record<string, number>;
}

interface CatalogoTableProps {
  items: CatalogItem[];
  /** Field key for the name column: "nombre" or "grupo" */
  nameKey: "nombre" | "grupo";
  nameLabel: string;
  namePlaceholder: string;
  onCrear: (data: { nombre?: string; grupo?: string; descripcion?: string }) => Promise<{ error?: string; success?: boolean }>;
  onEditar: (id: number, data: { nombre?: string; grupo?: string; descripcion?: string }) => Promise<{ error?: string; success?: boolean }>;
  onToggle: (id: number) => Promise<{ error?: string; success?: boolean }>;
  onEliminar: (id: number) => Promise<{ error?: string; success?: boolean }>;
  usageLabel?: string;
}

export function CatalogoTable({
  items,
  nameKey,
  nameLabel,
  namePlaceholder,
  onCrear,
  onEditar,
  onToggle,
  onEliminar,
  usageLabel = "En uso",
}: CatalogoTableProps) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CatalogItem | null>(null);

  const filtered = items.filter((item) => {
    const name = (nameKey === "grupo" ? item.grupo : item.nombre) ?? "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (item.descripcion ?? "").toLowerCase().includes(search.toLowerCase());
  });

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormDesc("");
    setError(null);
    setShowForm(true);
  };

  const openEdit = (item: CatalogItem) => {
    setShowForm(false);
    setEditingId(item.id);
    setFormName((nameKey === "grupo" ? item.grupo : item.nombre) ?? "");
    setFormDesc(item.descripcion ?? "");
    setError(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = () => {
    if (!formName.trim()) {
      setError(`El campo ${nameLabel.toLowerCase()} es requerido.`);
      return;
    }

    startTransition(async () => {
      const payload = {
        [nameKey]: formName.trim(),
        descripcion: formDesc.trim() || undefined,
      };

      const result = editingId !== null
        ? await onEditar(editingId, payload)
        : await onCrear(payload);

      if (result.error) {
        setError(result.error);
      } else {
        cancelForm();
      }
    });
  };

  const handleToggle = (id: number) => {
    startTransition(async () => {
      const result = await onToggle(id);
      if (result.error) setError(result.error);
    });
  };

  const handleEliminarClick = (item: CatalogItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmEliminar = () => {
    if (!itemToDelete) return;
    
    console.log("[Catálogos] Iniciando eliminación de ID:", itemToDelete.id);
    startTransition(async () => {
      try {
        const result = await onEliminar(itemToDelete.id);
        console.log("[Catálogos] Resultado eliminación:", result);
        if (result?.error) {
          setError(result.error);
        } else {
          setError(null);
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }
      } catch (err: any) {
        console.error("[Catálogos] Error en acción de eliminación:", err);
        setError(err.message || "Error inesperado al intentar eliminar el registro.");
      }
    });
  };

  const totalUsage = (item: CatalogItem) => {
    if (!item._count) return 0;
    return Object.values(item._count).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-muted/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1a1210] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#2d1a14] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 anim-scale">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Inline Create Form */}
      {showForm && (
        <div className="rounded-2xl bg-white shadow-lg p-5 space-y-3 anim-scale">
          <p className="text-sm font-bold">Nuevo registro</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              autoFocus
              placeholder={namePlaceholder}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="rounded-xl bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <input
              placeholder="Descripción (opcional)"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="rounded-xl bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button onClick={cancelForm} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg">Cancelar</button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{nameLabel}</th>
              <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Descripción</th>
              <th className="text-center py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{usageLabel}</th>
              <th className="text-center py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Estado</th>
              <th className="text-right py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((item) => {
              const name = nameKey === "grupo" ? item.grupo : item.nombre;
              const isEditing = editingId === item.id;

              return (
                <tr key={item.id} className={`group transition-colors ${!item.activo ? "opacity-50" : "hover:bg-muted/20"}`}>
                  {/* Name */}
                  <td className="py-3 px-5">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") cancelForm(); }}
                        className="rounded-lg bg-muted/50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="font-semibold">{name}</span>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-3 px-5 hidden sm:table-cell">
                    {isEditing ? (
                      <input
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") cancelForm(); }}
                        placeholder="Descripción..."
                        className="rounded-lg bg-muted/50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 w-full max-w-[300px]"
                      />
                    ) : (
                      <span className="text-muted-foreground">{item.descripcion || "—"}</span>
                    )}
                  </td>

                  {/* Usage count */}
                  <td className="py-3 px-5 text-center">
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-muted/60 px-2 text-xs font-bold tabular-nums">
                      {totalUsage(item)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-5 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      item.activo
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.activo ? "bg-emerald-500" : "bg-red-400"}`} />
                      {item.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-1 justify-end">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={cancelForm} className="h-8 w-8 rounded-lg bg-muted/50 text-muted-foreground flex items-center justify-center hover:bg-muted transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => openEdit(item)}
                            className="h-8 w-8 rounded-lg text-muted-foreground flex items-center justify-center hover:bg-muted/60 hover:text-foreground transition-all"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggle(item.id)}
                            disabled={isPending}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${
                              item.activo
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={item.activo ? "Desactivar" : "Activar"}
                          >
                            {item.activo ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleEliminarClick(item)}
                            disabled={isPending}
                            className="h-8 w-8 rounded-lg text-muted-foreground flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
                            title="Eliminar Permanente"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmEliminar}
        title="¿Eliminar Permanentemente?"
        description="Esta acción destruirá todos los registros conectados a este elemento de catálogo. ¿Deseas continuar?"
        itemName={(nameKey === "grupo" ? itemToDelete?.grupo : itemToDelete?.nombre) ?? ""}
        isLoading={isPending}
      />

      <p className="text-xs text-muted-foreground">
        {items.length} registros • {items.filter(i => i.activo).length} activos • {items.filter(i => !i.activo).length} inactivos
      </p>
    </div>
  );
}
