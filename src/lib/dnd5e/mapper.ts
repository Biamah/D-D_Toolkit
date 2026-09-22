import type { Monster } from "../../types";
import monsterNamesPtBR from "../../data/monsters/monsterNames.pt-BR.json";
import type { Dnd5eMonster } from "./types";

const API_ORIGIN = "https://www.dnd5eapi.co";

function resolveImage(image?: string) {
  if (!image) return undefined;
  return image.startsWith("http") ? image : `${API_ORIGIN}${image}`;
}

function resolveArmorClass(armorClass: Dnd5eMonster["armor_class"]) {
  return typeof armorClass === "number"
    ? armorClass
    : armorClass[0]?.value || 10;
}

/** Converte o DTO da D&D 5e API para o modelo de monstro usado pela aplicação. */
export function mapCreature(raw: Dnd5eMonster): Monster {
  const mapActions = (items?: Dnd5eMonster["actions"]) =>
    items?.map((action) => ({ name: action.name, description: action.desc }));
  const actions = mapActions(raw.actions) || [];
  return {
    id: raw.index,
    name: raw.name,
    translatedName:
      monsterNamesPtBR[raw.index as keyof typeof monsterNamesPtBR],
    size: raw.size || "Medium",
    type: raw.type || "Creature",
    alignment: raw.alignment || "Unaligned",
    armorClass: resolveArmorClass(raw.armor_class),
    hitPoints: raw.hit_points || 1,
    hitDice: raw.hit_dice,
    challengeRating: String(raw.challenge_rating ?? "—"),
    imageUrl: resolveImage(raw.image),
    source: "D&D 5e API",
    originalId: raw.index,
    abilities: {
      strength: raw.strength || 10,
      dexterity: raw.dexterity || 10,
      constitution: raw.constitution || 10,
      intelligence: raw.intelligence || 10,
      wisdom: raw.wisdom || 10,
      charisma: raw.charisma || 10,
    },
    attacks: actions.slice(0, 3).map((action) => action.name),
    actions,
    description: raw.desc,
    speed: raw.speed,
    savingThrows: raw.proficiencies
      .filter((item) => item.proficiency.index.startsWith("saving-throw-"))
      .map((item) => item.proficiency.name),
    proficiencies: raw.proficiencies.map((item) => ({
      name: item.proficiency.name,
      value: item.value,
    })),
    resistances: raw.damage_resistances,
    vulnerabilities: raw.damage_vulnerabilities,
    immunities: raw.damage_immunities,
    conditionImmunities: raw.condition_immunities?.map((item) => item.name),
    senses: raw.senses,
    languages: raw.languages,
    proficiencyBonus: raw.proficiency_bonus,
    xp: raw.xp,
    specialAbilities: mapActions(raw.special_abilities),
    legendaryActions: mapActions(raw.legendary_actions),
  };
}
