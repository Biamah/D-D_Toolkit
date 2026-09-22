import type { Monster } from "../../types";
import { mapCreature } from "./mapper";
import type {
  Dnd5eLanguage,
  Dnd5eList,
  Dnd5eMonster,
  Dnd5eReference,
} from "./types";

const API = "https://www.dnd5eapi.co/api/2014";
const creatureCache = new Map<Dnd5eLanguage, Monster[]>();
const speciesCache = new Map<
  Dnd5eLanguage,
  Array<{ key: string; name: string }>
>();

async function getJson<T>(url: string): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) return response.json() as Promise<T>;
    if (response.status !== 429 || attempt === 2) {
      throw new Error(`D&D 5e API respondeu com ${response.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 500));
  }
  throw new Error("Não foi possível carregar os dados da D&D 5e API");
}

function localizedUrl(path: string, language: Dnd5eLanguage) {
  return `${API}${path}?lang=${encodeURIComponent(language)}`;
}

/** Busca as raças da API no idioma selecionado para o gerador de NPC. */
export async function fetchSpecies(language: Dnd5eLanguage) {
  const cached = speciesCache.get(language);
  if (cached) return cached;
  const page = await getJson<Dnd5eList<Dnd5eReference>>(
    localizedUrl("/races", language),
  );
  const species = page.results
    .map((item) => ({ key: item.index, name: item.name }))
    .sort((a, b) => a.name.localeCompare(b.name, language));
  speciesCache.set(language, species);
  return species;
}

/** Busca a lista e os detalhes das criaturas, convertendo-os para o modelo interno. */
export async function fetchCreatures(language: Dnd5eLanguage) {
  const cached = creatureCache.get(language);
  if (cached) return cached;
  const page = await getJson<Dnd5eList<Dnd5eReference>>(
    localizedUrl("/monsters", language),
  );
  const creatures: Dnd5eMonster[] = [];
  for (let index = 0; index < page.results.length; index += 12) {
    const batch = page.results.slice(index, index + 12);
    creatures.push(
      ...(await Promise.all(
        batch.map((item) =>
          getJson<Dnd5eMonster>(
            localizedUrl(`/monsters/${item.index}`, language),
          ),
        ),
      )),
    );
  }
  const monsters = creatures
    .map(mapCreature)
    .sort((a, b) => a.name.localeCompare(b.name, language));
  creatureCache.set(language, monsters);
  return monsters;
}
