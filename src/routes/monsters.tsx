import { MonsterForge } from "../components/dnd/monsters/MonsterForge";
import type { Monster } from "../types";
export function MonstersRoute(props: {
  monsters: Monster[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  scaled: Monster | null;
  setScaled: (monster: Monster | null) => void;
  onSave: (monster: Monster) => void;
}) {
  return <MonsterForge {...props} />;
}
