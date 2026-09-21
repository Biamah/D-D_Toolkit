import type { Difficulty, Monster } from "../types";

const difficultyFactor: Record<Difficulty, number> = {
  Easy: 0.78,
  Medium: 1,
  Hard: 1.24,
  Deadly: 1.5,
};
export function scaleMonster(
  base: Monster,
  players: number,
  level: number,
  difficulty: Difficulty,
): Monster {
  const factor =
    difficultyFactor[difficulty] *
    (0.82 + level * 0.045) *
    (0.72 + players * 0.07);
  const abilities = Object.fromEntries(
    Object.entries(base.abilities).map(([key, value]) => [
      key,
      Math.min(30, Math.max(1, Math.round(value + (factor - 1) * 2))),
    ]),
  ) as unknown as Monster["abilities"];
  return {
    ...base,
    id: `${base.id}-scaled-${Date.now()}`,
    name: `${difficulty} ${base.name}`,
    source: "D&D Toolkit",
    originalId: base.id,
    hitPoints: Math.max(1, Math.round(base.hitPoints * factor)),
    armorClass: Math.max(8, Math.round(base.armorClass + (factor - 1) * 2)),
    challengeRating: `${base.challengeRating}*`,
    abilities,
  };
}
