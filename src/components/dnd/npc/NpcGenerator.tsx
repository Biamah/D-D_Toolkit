import { Check, RefreshCw, Sparkles, WandSparkles } from "lucide-react";
import { EmptyPreview } from "../../ui/EmptyPreview";
import { NpcCard } from "./NpcCard";
import { useNpcGenerator } from "../../../hooks/useNpcGenerator";
import type { Npc } from "../../../types";

export function NpcGenerator({
  species,
  loading,
  onSave,
}: {
  species: { key: string; name: string }[];
  loading: boolean;
  onSave: (npc: Npc) => void;
}) {
  const generator = useNpcGenerator(species);
  return (
    <div className="workspace-grid">
      <section className="form-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">CHARACTER SEED</span>
            <h2>Who walks into the tavern?</h2>
          </div>
          <span className="step-badge">01 / 02</span>
        </div>
        <label>
          Name <span>optional</span>
          <div className="input-with-action">
            <input
              value={generator.name}
              onChange={(event) => generator.setName(event.target.value)}
              placeholder="Leave blank to roll a name"
            />
            <button title="Generate random name" onClick={generator.randomName}>
              <RefreshCw size={16} />
            </button>
          </div>
        </label>
        <label>
          Race
          <select
            value={generator.race}
            onChange={(event) => generator.setRace(event.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading Open5e species..." : "Choose a species"}
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
            Level
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
            Role
            <select
              value={generator.role}
              onChange={(event) => generator.setRole(event.target.value)}
            >
              {generator.npcRoles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary full" onClick={generator.generate}>
          <Sparkles size={17} /> Generate NPC
        </button>
        <p className="form-note">
          <Check size={14} /> Species data is sourced from Open5e V2
        </p>
      </section>
      {generator.npc ? (
        <NpcCard npc={generator.npc} onSave={() => onSave(generator.npc!)} />
      ) : (
        <EmptyPreview
          icon={<WandSparkles />}
          title="Your NPC will appear here"
          text="Fill the seed form and let the story begin."
        />
      )}
    </div>
  );
}
