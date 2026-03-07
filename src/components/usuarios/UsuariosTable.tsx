"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  ShieldCheck,
  UserPlus,
  Mail,
  UserCircle,
  Settings2,
  Lock,
  Unlock,
  CheckCircle2,
  Activity,
  Trash2,
  ExternalLink,
  MoreVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  crearUsuario,
  actualizarUsuario,
  toggleEstadoUsuario,
  eliminarUsuario,
} from "@/app/actions/usuarios";

// ─── Delete Confirmation Dialog ────────────────────────────────────────────────
interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isLoading: boolean;
}

function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 anim-scale">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-sm">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estas a punto de eliminar el acceso de{" "}
              <span className="font-bold text-foreground">"{itemName}"</span>.{" "}
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-900/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Si, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function UsuariosTable({ initialUsers }: { initialUsers: any[] }) {
  const [usuarios, setUsuarios] = useState(initialUsers);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    email: "",
    rol: "operador",
  });

  const filteredUsuarios = usuarios.filter((u) =>
    (u.nombreUsuario + u.email).toLowerCase().includes(busqueda.toLowerCase())
  );

  const openForm = (u?: any) => {
    setError(null);
    setSuccess(null);
    if (u) {
      setEditingUser(u);
      setFormData({ nombreUsuario: u.nombreUsuario, email: u.email, rol: u.rol });
    } else {
      setEditingUser(null);
      setFormData({ nombreUsuario: "", email: "", rol: "operador" });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (editingUser) {
      const resp = await actualizarUsuario(editingUser.id, formData);
      if (resp.error) setError(resp.error);
      else {
        setSuccess("Permisos del usuario actualizados.");
        setUsuarios(usuarios.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
        setTimeout(() => setModalOpen(false), 1500);
      }
    } else {
      const resp = await crearUsuario(formData);
      if (resp.error) setError(resp.error);
      else {
        setSuccess("Cuenta de usuario creada con exito.");
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const handleToggleEstado = async (id: number, currentEstado: string) => {
    const activar = currentEstado === "inactivo";
    const resp = await toggleEstadoUsuario(id, activar);
    if (resp.error) alert(resp.error);
    else {
      setUsuarios(
        usuarios.map((u) =>
          u.id === id ? { ...u, estado: activar ? "activo" : "inactivo" } : u
        )
      );
    }
  };

  const handleEliminarClick = (u: any) => {
    setUserToDelete(u);
    setDeleteDialogOpen(true);
  };

  const confirmEliminar = async () => {
    if (!userToDelete) return;
    setIsPending(true);
    const resp = await eliminarUsuario(userToDelete.id);
    setIsPending(false);

    if (resp.error) {
      alert(resp.error);
    } else {
      setUsuarios(usuarios.filter((u) => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Sub Header / Search ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar usuario por nombre o correo..."
            className="w-full bg-white rounded-2xl h-12 pl-12 pr-4 text-[13px] font-medium outline-none border border-border/50 shadow-sm focus:border-red-500/30 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-900/20 transition-all hover:shadow-2xl hover:-translate-y-0.5"
        >
          <UserPlus className="h-4 w-4" />
          Invitar Empleado
        </button>
      </div>

      {/* ── Listado Moderno ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsuarios.map((u, i) => (
          <div
            key={u.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-all anim-fade-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {/* Card Header: avatar + name + dropdown */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md
                    ${
                      u.estado === "inactivo"
                        ? "bg-muted text-muted-foreground shadow-none"
                        : u.rol === "administrador"
                        ? "bg-gradient-to-br from-red-600 to-[#1a1210]"
                        : u.rol === "operador"
                        ? "bg-gradient-to-br from-teal-500 to-teal-700"
                        : "bg-gradient-to-br from-indigo-500 to-indigo-700"
                    }
                  `}
                >
                  {u.nombreUsuario.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className={`font-bold text-[15px] ${
                      u.estado === "inactivo"
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {u.nombreUsuario}
                  </h3>
                  <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-1.5 opacity-80 mt-0.5">
                    {u.rol === "administrador" ? (
                      <ShieldCheck className="h-3 w-3 text-red-500" />
                    ) : (
                      <UserCircle className="h-3 w-3" />
                    )}
                    {u.rol}
                  </p>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="relative group">
                <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border/50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 origin-top-right scale-95 group-hover:scale-100">
                  <Link
                    href={`/usuarios/${u.id}`}
                    className="w-full text-left px-4 py-2 text-sm font-semibold rounded-xl hover:bg-muted text-foreground transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />
                    Ver Expediente
                  </Link>
                  <button
                    onClick={() => openForm(u)}
                    className="w-full text-left px-4 py-2 text-sm font-semibold rounded-xl hover:bg-muted text-foreground transition-colors flex items-center gap-2"
                  >
                    <Settings2 className="h-3.5 w-3.5 text-amber-600" />
                    Editar Permisos
                  </button>
                  <button
                    onClick={() => handleToggleEstado(u.id, u.estado)}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                      u.estado === "inactivo"
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    {u.estado === "inactivo" ? (
                      <Unlock className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    {u.estado === "inactivo" ? "Reactivar Cuenta" : "Revocar Acceso"}
                  </button>
                  <div className="my-1 border-t border-border/30" />
                  <button
                    onClick={() => handleEliminarClick(u)}
                    className="w-full text-left px-4 py-2 text-sm font-semibold rounded-xl hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar Permanentemente
                  </button>
                </div>
              </div>
            </div>

            {/* Card Body: contact info */}
            <div className="space-y-3 mb-5 mt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 opacity-50 shrink-0" />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 opacity-50 shrink-0" />
                <span>
                  {u.ultimoAcceso
                    ? formatDistanceToNow(new Date(u.ultimoAcceso), {
                        addSuffix: true,
                        locale: es,
                      })
                    : "Sin acceso registrado"}
                </span>
              </div>
            </div>

            {/* Card Footer: status + date */}
            <div className="pt-4 border-t border-dashed border-border flex justify-between items-center bg-muted/10 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                  u.estado === "activo"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {u.estado === "activo" ? (
                  <Unlock className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {u.estado}
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/50">
                Alta: {new Date(u.fechaCreacion).toLocaleDateString("es-MX")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredUsuarios.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-border shadow-sm">
          <UserCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold text-foreground">No hay usuarios encontrados</h3>
          <p className="text-sm text-muted-foreground">Prueba buscando con otro termino.</p>
        </div>
      )}

      {/* ── Modal Formulario ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 anim-scale">
            <h2 className="text-2xl font-extrabold text-foreground mb-1 flex items-center gap-2">
              {editingUser ? (
                <Settings2 className="text-red-600 h-6 w-6" />
              ) : (
                <UserPlus className="text-red-600 h-6 w-6" />
              )}
              {editingUser ? "Editar Permisos" : "Invitar Colega"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {editingUser
                ? "Modifica el rol de sistema de este usuario de forma inmediata."
                : "Pre-autoriza la cuenta de un tecnico o medico para que el acceso funcione."}
            </p>

            {error && (
              <div className="mb-6 flex gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 flex gap-3 text-sm text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-bold mb-1.5 block">Nombre Corto / Identificador</label>
                <input
                  type="text"
                  required
                  value={formData.nombreUsuario}
                  onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
                  placeholder="Ej: Dr. Garcia"
                  className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-500/30 focus:bg-white transition-all text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">Correo Electronico Autorizado</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="medico@bancodesangre.com"
                  className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-500/30 focus:bg-white transition-all text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {!editingUser && (
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Con este correo podra iniciar sesion via Autenticacion Unificada (OAuth).
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">Rol de Seguridad</label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-500/30 focus:bg-white transition-all text-foreground"
                >
                  <option value="administrador">Administrador de Sistema (Full Access)</option>
                  <option value="operador">Operador Tecnico (Registro Clinico)</option>
                  <option value="consulta">Modo Consulta (Solo Lectura, Reportes)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-xl shadow-red-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  {editingUser ? "Guardar Cambios" : "Invitar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Dialog ── */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmEliminar}
        title="Eliminar Acceso Permanentemente"
        description="Esta accion eliminara las credenciales de acceso de forma permanente y no se puede deshacer."
        itemName={userToDelete?.nombreUsuario || ""}
        isLoading={isPending}
      />
    </div>
  );
}
