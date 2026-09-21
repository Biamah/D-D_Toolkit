import type { ApiList, CreatureApiModel } from "../../types";
import { mapCreature } from "./mapper";

const API = "https://api.open5e.com/v2";
const imageCache = new Map<string, string>();
async function getJson<T>(url: string): Promise<T> { const response = await fetch(url); if (!response.ok) throw new Error(`Open5e respondeu com ${response.status}`); return response.json() as Promise<T>; }

export async function fetchSpecies() {
  const pages: Array<ApiList<{ key: string; name: string; is_subspecies: boolean }>> = [];
  let url: string | null = `${API}/species/?page_size=100`;
  while (url && pages.length < 3) { const page: ApiList<{ key: string; name: string; is_subspecies: boolean }> = await getJson(url); pages.push(page); url = page.next; }
  return pages.flatMap((page) => page.results).filter((species) => !species.is_subspecies).sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCreatures() {
  const page = await getJson<ApiList<CreatureApiModel>>(`${API}/creatures/?page_size=100`);
  const images = await getJson<ApiList<{ name: string; file_url: string }>>(`${API}/images/?page_size=100`);
  images.results.forEach((image) => imageCache.set(image.name.toLowerCase(), image.file_url));
  return page.results.map((creature) => mapCreature(creature, imageCache));
}