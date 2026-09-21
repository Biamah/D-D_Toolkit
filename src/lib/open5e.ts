import type { ApiList, CreatureApiModel, Monster } from "../types";

const API = "https://api.open5e.com/v2";
const imageCache = new Map<string, string>();

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open5e respondeu com ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchSpecies() {
  const pages: Array<
    ApiList<{ key: string; name: string; is_subspecies: boolean }>
  > = [];
  let url: string | null = `${API}/species/?page_size=100`;
  while (url && pages.length < 3) {
    const page: ApiList<{ key: string; name: string; is_subspecies: boolean }> =
      await getJson<
        ApiList<{ key: string; name: string; is_subspecies: boolean }>
      >(url);
    pages.push(page);
    url = page.next;
  }
  return pages
    .flatMap((page) => page.results)
    .filter((species) => !species.is_subspecies)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCreatures() {
  const page = await getJson<ApiList<CreatureApiModel>>(
    `${API}/creatures/?page_size=100`,
  );
  const images = await getJson<ApiList<{ name: string; file_url: string }>>(
    `${API}/images/?page_size=100`,
  );
  images.results.forEach((image) =>
    imageCache.set(image.name.toLowerCase(), image.file_url),
  );
  return page.results.map(mapCreature);
}

function mapCreature(raw: CreatureApiModel): Monster {
  const name = raw.name || "Unnamed creature";
  const imagePath = raw.image || imageCache.get(name.toLowerCase());
  return {
    id: raw.key || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    size: raw.size || "Medium",
    type: raw.type || "Creature",
    alignment: raw.alignment || "Unaligned",
    armorClass: Number(raw.armor_class) || 10,
    hitPoints: raw.hit_points || 1,
    challengeRating: String(raw.challenge_rating ?? "—"),
    imageUrl: imagePath
      ? imagePath.startsWith("http")
        ? imagePath
        : `https://api.open5e.com${imagePath}`
      : undefined,
    source: "Open5e",
    originalId: raw.key,
    abilities: {
      strength: raw.strength || 10,
      dexterity: raw.dexterity || 10,
      constitution: raw.constitution || 10,
      intelligence: raw.intelligence || 10,
      wisdom: raw.wisdom || 10,
      charisma: raw.charisma || 10,
    },
    attacks: (raw.actions || [])
      .slice(0, 3)
      .map((action) => action.name || "Action"),
    description: raw.desc,
  };
}
