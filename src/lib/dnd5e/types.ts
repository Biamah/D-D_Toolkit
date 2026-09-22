export type Dnd5eLanguage = "en" | "pt-BR";

export interface Dnd5eReference {
  index: string;
  name: string;
  url: string;
}

export interface Dnd5eList<T> {
  count: number;
  results: T[];
}

export interface Dnd5eArmorClass {
  value: number;
}

export interface Dnd5eProficiency {
  value: number;
  proficiency: Dnd5eReference;
}

export interface Dnd5eAction {
  name: string;
  desc: string;
}

export interface Dnd5eMonster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: Dnd5eArmorClass[] | number;
  hit_points: number;
  hit_dice: string;
  speed: Record<string, string>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: Dnd5eProficiency[];
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: Dnd5eReference[];
  senses: Record<string, string | number>;
  languages: string;
  challenge_rating: number | string;
  actions: Dnd5eAction[];
  proficiency_bonus: number;
  xp: number;
  special_abilities?: Dnd5eAction[];
  legendary_actions?: Dnd5eAction[];
  desc?: string;
  image?: string;
}
