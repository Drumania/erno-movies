import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Eliminar acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-") // Reemplazar espacios por -
    .replace(/[^\w-]+/g, "") // Eliminar caracteres no alfanuméricos
    .replace(/--+/g, "-") // Reemplazar múltiples - por uno solo
    .replace(/^-+/, "") // Eliminar - al principio
    .replace(/-+$/, ""); // Eliminar - al final
}
