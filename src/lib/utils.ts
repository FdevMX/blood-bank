import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateSafe(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "N/D";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "N/D";
    const iso = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const [y, m, day] = iso.split("-");
    const arrMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    // Return an aesthetic short format: "07 Mar 2026" or similar
    return `${day} ${arrMeses[parseInt(m) - 1]} ${y}`;
  } catch {
    return "N/D";
  }
}
