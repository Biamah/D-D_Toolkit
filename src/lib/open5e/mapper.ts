import type { CreatureApiModel } from "../../types";
import type { Monster } from "../../types";

export function mapCreature(
  raw: CreatureApiModel,
  imageCache: Map<string, string>,
): Monster {
  const name = raw.name || "Unnamed creature";
  const imagePath = raw.image || imageCache.get(name.toLowerCase());
  const size = typeof raw.size === "string" ? raw.size : raw.size?.name;
  const type = typeof raw.type === "string" ? raw.type : raw.type?.name;
  return {
    id: raw.key || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    size: size || "Medium",
    type: type || "Creature",
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
