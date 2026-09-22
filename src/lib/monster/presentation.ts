import type { MonsterAction } from "../../types";

/** Converte valores estruturados da API em texto sem traduzir nem alterar seus dados. */
export function formatMonsterValue(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, item]) => item !== undefined && item !== null && item !== "")
      .map(([key, item]) => `${key}: ${item}`)
      .join(" · ");
  }
  return value === undefined || value === null || value === ""
    ? ""
    : String(value);
}

/** Verifica se um valor possui conteúdo renderizável na ficha. */
export function hasMonsterValue(value: unknown) {
  return formatMonsterValue(value).length > 0;
}

/** Formata uma habilidade mantendo nome e descrição retornados pela API. */
export function formatMonsterAction(action: MonsterAction) {
  return action.description
    ? `${action.name}: ${action.description}`
    : action.name;
}
