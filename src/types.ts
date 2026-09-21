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
export interface Monster {
  id: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  challengeRating: string;
  imageUrl?: string;
  source: "Open5e" | "D&D Toolkit";
  originalId?: string;
  abilities: AbilityScores;
  attacks: string[];
  description?: string;
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

export interface CreatureApiModel {
  key?: string;
  name?: string;
  size?: string;
  type?: string;
  alignment?: string;
  armor_class?: number | string;
  hit_points?: number;
  challenge_rating?: string | number;
  image?: string;
  desc?: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  actions?: Array<{ name?: string; desc?: string }>;
}
export interface ApiList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const emptyAbilities = (): AbilityScores => ({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
});
