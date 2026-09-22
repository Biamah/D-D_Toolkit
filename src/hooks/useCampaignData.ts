import { useEffect, useMemo, useState } from "react";
import { fetchCreatures, fetchSpecies } from "../lib/dnd5e/api";
import type { Dnd5eLanguage } from "../lib/dnd5e/types";
import type { Monster } from "../types";
import type { Language } from "./useTranslation";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

/** Carrega dados traduzidos da D&D 5e API e oferece monstros filtrados pela busca atual. */
export function useCampaignData(query: string, language: Language) {
  const [species, setSpecies] = useState<{ key: string; name: string }[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      fetchSpecies(language as Dnd5eLanguage),
      fetchCreatures(language as Dnd5eLanguage),
    ])
      .then(([nextSpecies, nextMonsters]) => {
        if (cancelled) return;
        setSpecies(nextSpecies);
        setMonsters(nextMonsters);
      })
      .catch(() => {
        if (!cancelled) setError("dnd5e");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const filteredMonsters = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    return monsters.filter((monster) =>
      [monster.name, language === "pt-BR" ? monster.translatedName : undefined]
        .filter(Boolean)
        .some((name) => normalizeSearchText(name!).includes(normalizedQuery)),
    );
  }, [language, monsters, query]);

  return { species, monsters, filteredMonsters, loading, error };
}
