import { NpcGenerator } from "../components/dnd/npc/NpcGenerator";
import type { Npc } from "../types";
export function NpcRoute({
  species,
  loading,
  onSave,
}: {
  species: { key: string; name: string }[];
  loading: boolean;
  onSave: (npc: Npc) => void;
}) {
  return <NpcGenerator species={species} loading={loading} onSave={onSave} />;
}
