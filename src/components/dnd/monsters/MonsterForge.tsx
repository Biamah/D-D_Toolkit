import {
  Download,
  ChevronDown,
  LoaderCircle,
  Search,
  Sparkles,
  Swords,
} from "lucide-react";
import { EmptyPreview } from "../../ui/EmptyPreview";
import { characterLevels } from "../../../data/options";
import { scaleMonster } from "../../../lib/monster/scaling";
import type { Difficulty, Monster } from "../../../types";
import { useState } from "react";

export function MonsterForge({
  monsters,
  loading,
  query,
  setQuery,
  scaled,
  setScaled,
  onSave,
}: {
  monsters: Monster[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  scaled: Monster | null;
  setScaled: (monster: Monster | null) => void;
  onSave: (monster: Monster) => void;
}) {
  const [selected, setSelected] = useState<Monster | null>(null);
  const [players, setPlayers] = useState("4");
  const [level, setLevel] = useState("5");
  const [difficulty, setDifficulty] = useState<Difficulty>("Hard");
  return (
    <div className="monster-layout">
      <section className="browser-panel">
        <div className="browser-head">
          <div>
            <span className="eyebrow">OPEN5E V2 / CREATURES</span>
            <h2>Choose your base</h2>
          </div>
          <span className="result-count">
            {loading ? "..." : `${monsters.length} found`}
          </span>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creatures..."
          />
        </div>
        <div className="monster-list">
          {loading ? (
            <div className="loading">
              <LoaderCircle className="spin" /> Loading Open5e creatures
            </div>
          ) : monsters.length === 0 ? (
            <div className="loading">
              <Swords size={22} />
              <strong>No creatures found</strong>
              <span>Try another search or refresh the Open5e data.</span>
            </div>
          ) : (
            monsters.slice(0, 20).map((monster) => (
              <button
                className={`monster-row ${selected?.id === monster.id ? "selected" : ""}`}
                key={monster.id}
                onClick={() => {
                  setSelected(monster);
                  setScaled(null);
                }}
              >
                <div className="mini-avatar">
                  {monster.imageUrl ? (
                    <img src={monster.imageUrl} alt="" />
                  ) : (
                    <Swords size={16} />
                  )}
                </div>
                <div>
                  <strong>{monster.name}</strong>
                  <span>
                    {monster.type} · CR {monster.challengeRating}
                  </span>
                </div>
                <ChevronDown size={15} />
              </button>
            ))
          )}
        </div>
      </section>
      <section className="scaling-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow warm">RULE ENGINE / MVP</span>
            <h2>Balance the encounter</h2>
          </div>
        </div>
        {selected ? (
          <>
            <div className="selected-creature">
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.name} />
              ) : (
                <div className="creature-placeholder">
                  <Swords size={30} />
                </div>
              )}
              <div>
                <span>BASE CREATURE</span>
                <h3>{selected.name}</h3>
                <p>Original Open5e data remains untouched.</p>
              </div>
            </div>
            <div className="two-col">
              <label>
                Players
                <select
                  value={players}
                  onChange={(event) => setPlayers(event.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Avg. level
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  {characterLevels.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Desired difficulty
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
              >
                {(["Easy", "Medium", "Hard", "Deadly"] as Difficulty[]).map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <button
              className="primary full"
              onClick={() =>
                setScaled(
                  scaleMonster(
                    selected,
                    Number(players),
                    Number(level),
                    difficulty,
                  ),
                )
              }
            >
              <Sparkles size={17} /> Forge balanced version
            </button>
            {scaled && (
              <div className="result-card reveal">
                <span className="eyebrow warm">YOUR VARIANT</span>
                <h3>{scaled.name}</h3>
                <div className="stat-strip">
                  <div>
                    <span>HP</span>
                    <strong>{scaled.hitPoints}</strong>
                  </div>
                  <div>
                    <span>AC</span>
                    <strong>{scaled.armorClass}</strong>
                  </div>
                  <div>
                    <span>CR</span>
                    <strong>{scaled.challengeRating}</strong>
                  </div>
                </div>
                <button
                  className="secondary full"
                  onClick={() => onSave(scaled)}
                >
                  <Download size={16} /> Save .a5e sheet
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyPreview
            icon={<Swords />}
            title="Select a creature"
            text="Pick an Open5e creature to start tuning the encounter."
          />
        )}
      </section>
    </div>
  );
}
