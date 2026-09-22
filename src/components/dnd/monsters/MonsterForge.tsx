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
import {
  formatMonsterAction,
  formatMonsterValue,
  hasMonsterValue,
} from "../../../lib/monster/presentation";
import type { Difficulty, Monster } from "../../../types";
import { useState } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

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
  const { language, t } = useTranslation();
  const [selected, setSelected] = useState<Monster | null>(null);
  const [players, setPlayers] = useState("4");
  const [level, setLevel] = useState("5");
  const [difficulty, setDifficulty] = useState<Difficulty>("Hard");
  const defenseDetails: Array<[string, unknown]> = scaled
    ? [
        ["monster.details.resistances", scaled.resistances],
        ["monster.details.immunities", scaled.immunities],
        ["monster.details.vulnerabilities", scaled.vulnerabilities],
        ["monster.details.conditionImmunities", scaled.conditionImmunities],
      ]
    : [];
  const featureDetails: Array<[string, unknown]> = scaled
    ? [
        ["monster.details.speed", scaled.speed],
        ["monster.details.senses", scaled.senses],
        ["monster.details.languages", scaled.languages],
        ["monster.details.proficiencyBonus", scaled.proficiencyBonus],
        ["monster.details.xp", scaled.xp],
      ]
    : [];
  return (
    <div className="monster-layout">
      <section className="browser-panel">
        <div className="browser-head">
          <div>
            <span className="eyebrow">{t("monster.dnd5e")}</span>
            <h2>{t("monster.chooseBase")}</h2>
          </div>
          <span className="result-count">
            {loading ? "..." : t("monster.found", { count: monsters.length })}
          </span>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("monster.searchPlaceholder")}
          />
        </div>
        <div className="monster-list">
          {loading ? (
            <div className="loading">
              <LoaderCircle className="spin" /> {t("monster.loading")}
            </div>
          ) : monsters.length === 0 ? (
            <div className="loading">
              <Swords size={22} />
              <strong>{t("monster.noResults")}</strong>
              <span>{t("monster.noResultsText")}</span>
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
                  <strong>
                    {language === "pt-BR"
                      ? monster.translatedName || monster.name
                      : monster.name}
                  </strong>
                  <span>
                    {language === "pt-BR" && monster.translatedName
                      ? `${monster.name} · `
                      : ""}
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
            <span className="eyebrow warm">{t("monster.ruleEngine")}</span>
            <h2>{t("monster.balance")}</h2>
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
                <span>{t("monster.baseLabel")}</span>
                <h3>
                  {language === "pt-BR"
                    ? selected.translatedName || selected.name
                    : selected.name}
                </h3>
                <p>{t("monster.originalNote")}</p>
              </div>
            </div>
            <div className="two-col">
              <label>
                {t("monster.players")}
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
                {t("monster.averageLevel")}
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
              {t("monster.difficulty")}
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
              >
                {(["Easy", "Medium", "Hard", "Deadly"] as Difficulty[]).map(
                  (item) => (
                    <option key={item} value={item}>
                      {t(`difficulty.${item}`)}
                    </option>
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
              <Sparkles size={17} /> {t("monster.forge")}
            </button>
            {scaled && (
              <div className="result-card reveal">
                <span className="eyebrow warm">{t("monster.variant")}</span>
                <h3>{scaled.name}</h3>
                <div className="stat-strip">
                  <div>
                    <span>{t("common.hp")}</span>
                    <strong>{scaled.hitPoints}</strong>
                  </div>
                  <div>
                    <span>{t("common.ac")}</span>
                    <strong>{scaled.armorClass}</strong>
                  </div>
                  <div>
                    <span>{t("monster.cr")}</span>
                    <strong>{scaled.challengeRating}</strong>
                  </div>
                </div>
                <div className="variant-details">
                  {defenseDetails.some(([, value]) =>
                    hasMonsterValue(value),
                  ) ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.hitDiceSection")}</h4>
                      {defenseDetails.map(([label, value]) =>
                        hasMonsterValue(value) ? (
                          <div className="variant-detail-row" key={label}>
                            <span>{t(label)}</span>
                            <strong>{formatMonsterValue(value)}</strong>
                          </div>
                        ) : null,
                      )}
                    </section>
                  ) : null}

                  {featureDetails.some(([, value]) =>
                    hasMonsterValue(value),
                  ) ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.features")}</h4>
                      {featureDetails.map(([label, value]) =>
                        hasMonsterValue(value) ? (
                          <div className="variant-detail-row" key={label}>
                            <span>{t(label)}</span>
                            <strong>{formatMonsterValue(value)}</strong>
                          </div>
                        ) : null,
                      )}
                    </section>
                  ) : null}

                  {scaled.hitDice ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.defenses")}</h4>
                      <div className="variant-detail-row">
                        <span>{t("monster.details.hitDice")}</span>
                        <strong>{scaled.hitDice}</strong>
                      </div>
                    </section>
                  ) : null}

                  <section className="variant-detail-section">
                    <h4>{t("monster.details.abilities")}</h4>
                    <div className="variant-ability-grid">
                      {(
                        [
                          [
                            "monster.details.strength",
                            scaled.abilities.strength,
                          ],
                          [
                            "monster.details.dexterity",
                            scaled.abilities.dexterity,
                          ],
                          [
                            "monster.details.constitution",
                            scaled.abilities.constitution,
                          ],
                          [
                            "monster.details.intelligence",
                            scaled.abilities.intelligence,
                          ],
                          ["monster.details.wisdom", scaled.abilities.wisdom],
                          [
                            "monster.details.charisma",
                            scaled.abilities.charisma,
                          ],
                        ] as Array<[string, number]>
                      ).map(([label, value]) => (
                        <div key={label}>
                          <span>{t(label)}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </section>

                  {scaled.actions?.length ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.actions")}</h4>
                      <ul className="variant-detail-list">
                        {scaled.actions.map((action) => (
                          <li key={action.name}>
                            {formatMonsterAction(action)}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {scaled.proficiencies?.length ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.proficiencies")}</h4>
                      <ul className="variant-detail-list">
                        {scaled.proficiencies.map((proficiency) => (
                          <li key={proficiency.name}>
                            <strong>{proficiency.name}</strong>
                            <span>
                              {t("monster.details.proficiencyValue", {
                                value: proficiency.value,
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {scaled.specialAbilities?.length ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.specialAbilities")}</h4>
                      <ul className="variant-detail-list">
                        {scaled.specialAbilities.map((ability) => (
                          <li key={ability.name}>
                            {formatMonsterAction(ability)}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {scaled.legendaryActions?.length ? (
                    <section className="variant-detail-section">
                      <h4>{t("monster.details.legendaryActions")}</h4>
                      <ul className="variant-detail-list">
                        {scaled.legendaryActions.map((action) => (
                          <li key={action.name}>
                            {formatMonsterAction(action)}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
                <button
                  className="secondary full"
                  onClick={() => onSave(scaled)}
                >
                  <Download size={16} /> {t("npc.save")}
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyPreview
            icon={<Swords />}
            title={t("monster.emptyTitle")}
            text={t("monster.emptyText")}
          />
        )}
      </section>
    </div>
  );
}
