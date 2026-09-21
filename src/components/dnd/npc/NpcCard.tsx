import { Check, Download, Heart, WandSparkles } from "lucide-react";
import type { Npc } from "../../../types";
import { useTranslation } from "../../../hooks/useTranslation";

export function NpcCard({ npc, onSave }: { npc: Npc; onSave: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="sheet-card reveal">
      <div className="sheet-top">
        <div className="portrait npc-portrait">
          <WandSparkles size={32} />
        </div>
        <div>
          <span className="eyebrow warm">
            {t("npc.cardLabel", {
              role: t(`npc.roles.${npc.role}`).toUpperCase(),
            })}
          </span>
          <h2>{npc.name}</h2>
          <p>{t("npc.levelRace", { level: npc.level, race: npc.race })}</p>
        </div>
        <button className="favorite">
          <Heart size={18} />
        </button>
      </div>
      <div className="stat-strip">
        <div>
          <span>{t("common.hp")}</span>
          <strong>{npc.hitPoints}</strong>
        </div>
        <div>
          <span>{t("common.ac")}</span>
          <strong>{npc.armorClass}</strong>
        </div>
        <div>
          <span>{t("npc.level")}</span>
          <strong>{npc.level}</strong>
        </div>
      </div>
      <div className="sheet-section">
        <span className="eyebrow">{t("npc.traits")}</span>
        {npc.traits.map((trait) => (
          <div className="trait" key={trait}>
            <Check size={14} />
            {trait}
          </div>
        ))}
      </div>
      <button className="primary full" onClick={onSave}>
        <Download size={16} /> {t("npc.save")}
      </button>
    </section>
  );
}
