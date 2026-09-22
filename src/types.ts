export type LibraryType = "npc" | "monster";
export type Difficulty = "Easy" | "Medium" | "Hard" | "Deadly";

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}
export interface MonsterAction {
  name: string;
  description?: string;
}
export interface MonsterProficiency {
  name: string;
  value: number;
}
export interface Monster {
  id: string;
  name: string;
  translatedName?: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  hitDice?: string;
  challengeRating: string;
  imageUrl?: string;
  source: "D&D 5e API" | "D&D Toolkit";
  originalId?: string;
  abilities: AbilityScores;
  attacks: string[];
  description?: string;
  speed?: Record<string, string>;
  savingThrows?: string[];
  proficiencies?: MonsterProficiency[];
  resistances?: string[];
  vulnerabilities?: string[];
  immunities?: string[];
  conditionImmunities?: string[];
  senses?: Record<string, string | number>;
  languages?: string;
  proficiencyBonus?: number;
  xp?: number;
  actions?: MonsterAction[];
  specialAbilities?: MonsterAction[];
  legendaryActions?: MonsterAction[];
}
export interface Npc {
  id: string;
  name: string;
  race: string;
  level: number;
  role: string;
  hitPoints: number;
  armorClass: number;
  abilities: AbilityScores;
  traits: string[];
  source: "D&D Toolkit";
}
export interface SavedSheet {
  version: 1;
  type: LibraryType;
  data: Npc | Monster;
  metadata: { id: string; title: string; favorite: boolean; updatedAt: string };
}

export const emptyAbilities = (): AbilityScores => ({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
});
