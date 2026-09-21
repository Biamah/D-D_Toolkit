import { useEffect, useMemo, useState } from "react";
import { fetchCreatures, fetchSpecies } from "../lib/open5e/api";
import type { Monster } from "../types";

export function useCampaignData(query: string) {
  const [species, setSpecies] = useState<{ key: string; name: string }[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchSpecies(), fetchCreatures()])
      .then(([nextSpecies, nextMonsters]) => {
        setSpecies(nextSpecies);
        setMonsters(nextMonsters);
      })
      .catch(() => setError("open5e"))
      .finally(() => setLoading(false));
  }, []);

  const filteredMonsters = useMemo(
    () =>
      monsters.filter((monster) =>
        monster.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [monsters, query],
  );

  return { species, monsters, filteredMonsters, loading, error };
}
