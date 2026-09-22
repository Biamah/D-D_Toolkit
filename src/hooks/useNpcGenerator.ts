import { useState } from "react";
import { characterLevels, npcNames, npcRoles } from "../data/options";
import { emptyAbilities } from "../types";
import type { Npc } from "../types";

/** Mantém os campos do NPC em edição e gera uma ficha com atributos derivados do nível. */
export function useNpcGenerator(species: { name: string }[]) {
  const [npc, setNpc] = useState<Npc | null>(null);
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [level, setLevel] = useState("3");
  const [role, setRole] = useState(npcRoles[0]);

  /** Escolhe um nome aleatório da lista de nomes disponíveis. */
  const randomName = () =>
    setName(npcNames[Math.floor(Math.random() * npcNames.length)]);

  /** Cria um NPC usando os campos atuais e valores padrão quando necessário. */
  const generate = () => {
    const actualLevel = Number(level);
    setNpc({
      id: crypto.randomUUID(),
      name:
        name.trim() || npcNames[Math.floor(Math.random() * npcNames.length)],
      race: race || species[0]?.name || "Human",
      level: actualLevel,
      role,
      hitPoints: 8 + actualLevel * 5,
      armorClass: 10 + Math.ceil(actualLevel / 2),
      abilities: emptyAbilities(),
      traits: ["Reliable contact", "Knows the local roads"],
      source: "D&D Toolkit",
    });
  };
  return {
    npc,
    setNpc,
    name,
    setName,
    race,
    setRace,
    level,
    setLevel,
    role,
    setRole,
    randomName,
    generate,
    characterLevels,
    npcRoles,
  };
}
