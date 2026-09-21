import {
  BookOpen,
  FolderOpen,
  Library,
  Swords,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { QuickCard } from "../../ui/QuickCard";
import { Stat } from "../../ui/Stat";
import type { SavedSheet } from "../../../types";
import type { View } from "../../layout/AppShell";

export function Dashboard({
  saved,
  setView,
}: {
  saved: SavedSheet[];
  setView: (view: View) => void;
}) {
  return (
    <>
      <section className="hero-panel">
        <div>
          <span className="eyebrow warm">THE DM'S DESK</span>
          <h2>
            Build encounters
            <br />
            <em>worth remembering.</em>
          </h2>
          <p>
            Shape the people and creatures that make your campaign feel alive.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setView("npc")}>
              <WandSparkles size={17} /> Create an NPC
            </button>
            <button className="secondary" onClick={() => setView("monsters")}>
              <Swords size={17} /> Forge a monster
            </button>
          </div>
        </div>
        <div className="sigil">
          <span>✦</span>
          <small>
            TOOLS FOR
            <br />
            STORYTELLERS
          </small>
        </div>
      </section>
      <section className="stats-grid">
        <Stat
          label="Saved sheets"
          value={String(saved.length).padStart(2, "0")}
          icon={<BookOpen size={19} />}
        />
        <Stat label="Open5e creatures" value="—" icon={<Swords size={19} />} />
        <Stat
          label="Local-first"
          value="100%"
          icon={<FolderOpen size={19} />}
        />
      </section>
      <section className="section-heading">
        <div>
          <span className="eyebrow">QUICK START</span>
          <h3>Choose your next move</h3>
        </div>
      </section>
      <div className="quick-grid">
        <QuickCard
          icon={<WandSparkles />}
          title="Make an NPC"
          text="A name, a lineage, a story hook."
          onClick={() => setView("npc")}
        />
        <QuickCard
          icon={<Swords />}
          title="Balance a monster"
          text="Tune the threat to your table."
          onClick={() => setView("monsters")}
        />
        <QuickCard
          icon={<Library />}
          title="Open your library"
          text="Everything saved for this campaign."
          onClick={() => setView("library")}
        />
      </div>
    </>
  );
}
