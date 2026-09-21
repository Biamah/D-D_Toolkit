import { Check, RefreshCw, Sparkles, WandSparkles } from "lucide-react";
import { EmptyPreview } from "../../ui/EmptyPreview";
import { NpcCard } from "./NpcCard";
import { useNpcGenerator } from "../../../hooks/useNpcGenerator";
import type { Npc } from "../../../types";
import { useTranslation } from "../../../hooks/useTranslation";

export function NpcGenerator({
  species,
  loading,
  onSave,
}: {
  species: { key: string; name: string }[];
  loading: boolean;
  onSave: (npc: Npc) => void;
}) {
  const { t } = useTranslation();
  const generator = useNpcGenerator(species);
  return (
    <div className="workspace-grid">
      <section className="form-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">{t("npc.seed")}</span>
            <h2>{t("npc.prompt")}</h2>
          </div>
          <span className="step-badge">{t("npc.step")}</span>
        </div>
        <label>
          {t("npc.name")} <span>{t("npc.optional")}</span>
          <div className="input-with-action">
            <input
              value={generator.name}
              onChange={(event) => generator.setName(event.target.value)}
              placeholder={t("npc.namePlaceholder")}
            />
            <button title={t("npc.randomName")} onClick={generator.randomName}>
              <RefreshCw size={16} />
            </button>
          </div>
        </label>
        <label>
          {t("npc.race")}
          <select
            value={generator.race}
            onChange={(event) => generator.setRace(event.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? t("npc.loadingSpecies") : t("npc.chooseSpecies")}
            </option>
            {species.map((item) => (
              <option key={item.key} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="two-col">
          <label>
            {t("npc.level")}
            <select
              value={generator.level}
              onChange={(event) => generator.setLevel(event.target.value)}
            >
              {generator.characterLevels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            {t("npc.role")}
            <select
              value={generator.role}
              onChange={(event) => generator.setRole(event.target.value)}
            >
              {generator.npcRoles.map((item) => (
                <option key={item} value={item}>
                  {t(`npc.roles.${item}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary full" onClick={generator.generate}>
          <Sparkles size={17} /> {t("npc.generate")}
        </button>
        <p className="form-note">
          <Check size={14} /> {t("npc.sourceNote")}
        </p>
      </section>
      {generator.npc ? (
        <NpcCard npc={generator.npc} onSave={() => onSave(generator.npc!)} />
      ) : (
        <EmptyPreview
          icon={<WandSparkles />}
          title={t("npc.emptyTitle")}
          text={t("npc.emptyText")}
        />
      )}
    </div>
  );
}
