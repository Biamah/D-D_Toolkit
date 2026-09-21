import { Check, Download, Heart, WandSparkles } from "lucide-react";
import type { Npc } from "../../../types";

export function NpcCard({ npc, onSave }: { npc: Npc; onSave: () => void }) {
  return (
    <section className="sheet-card reveal">
      <div className="sheet-top">
        <div className="portrait npc-portrait">
          <WandSparkles size={32} />
        </div>
        <div>
          <span className="eyebrow warm">NPC / {npc.role.toUpperCase()}</span>
          <h2>{npc.name}</h2>
          <p>
            Level {npc.level} {npc.race}
          </p>
        </div>
        <button className="favorite">
          <Heart size={18} />
        </button>
      </div>
      <div className="stat-strip">
        <div>
          <span>HP</span>
          <strong>{npc.hitPoints}</strong>
        </div>
        <div>
          <span>AC</span>
          <strong>{npc.armorClass}</strong>
        </div>
        <div>
          <span>LEVEL</span>
          <strong>{npc.level}</strong>
        </div>
      </div>
      <div className="sheet-section">
        <span className="eyebrow">TRAITS</span>
        {npc.traits.map((trait) => (
          <div className="trait" key={trait}>
            <Check size={14} />
            {trait}
          </div>
        ))}
      </div>
      <button className="primary full" onClick={onSave}>
        <Download size={16} /> Save .a5e sheet
      </button>
    </section>
  );
}
