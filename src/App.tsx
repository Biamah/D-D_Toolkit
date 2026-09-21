import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  FilePlus2,
  FolderOpen,
  Gem,
  Heart,
  Library,
  LoaderCircle,
  RefreshCw,
  Search,
  Sparkles,
  Swords,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { fetchCreatures, fetchSpecies } from "./lib/open5e";
import {
  downloadSheet,
  importSheet,
  connectLibrary,
  readLibrary,
} from "./lib/sheets";
import { scaleMonster } from "./lib/scaling";
import type { Difficulty, Monster, Npc, SavedSheet } from "./types";
import { emptyAbilities } from "./types";

const names = [
  "Ariadne",
  "Bram",
  "Caspian",
  "Dahlia",
  "Eamon",
  "Fiora",
  "Garrick",
  "Ilyra",
  "Joren",
  "Mirelle",
  "Neris",
  "Orin",
];
const roles = ["Wanderer", "Merchant", "Informant", "Sage", "Rival"];
const levels = Array.from({ length: 20 }, (_, index) => index + 1);

function App() {
  const [view, setView] = useState<
    "dashboard" | "npc" | "monsters" | "library"
  >("dashboard");
  const [species, setSpecies] = useState<{ key: string; name: string }[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [npc, setNpc] = useState<Npc | null>(null);
  const [scaled, setScaled] = useState<Monster | null>(null);
  const [saved, setSaved] = useState<SavedSheet[]>([]);
  const [query, setQuery] = useState("");
  const [directory, setDirectory] = useState<FileSystemDirectoryHandle | null>(
    null,
  );

  useEffect(() => {
    Promise.all([fetchSpecies(), fetchCreatures()])
      .then(([nextSpecies, nextMonsters]) => {
        setSpecies(nextSpecies);
        setMonsters(nextMonsters);
      })
      .catch(() =>
        setError("Não foi possível alcançar a Open5e agora. Tente novamente."),
      )
      .finally(() => setLoading(false));
  }, []);
  const filteredMonsters = useMemo(
    () =>
      monsters.filter((monster) =>
        monster.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [monsters, query],
  );
  const save = (data: Npc | Monster, type: "npc" | "monster") => {
    const sheet: SavedSheet = {
      version: 1,
      type,
      data,
      metadata: {
        id: data.id,
        title: data.name,
        favorite: false,
        updatedAt: new Date().toISOString(),
      },
    };
    setSaved((items) => [
      sheet,
      ...items.filter((item) => item.metadata.id !== sheet.metadata.id),
    ]);
    downloadSheet(sheet);
  };
  const openLibrary = async () => {
    const handle = await connectLibrary();
    if (handle) {
      setDirectory(handle);
      setSaved(await readLibrary(handle));
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Gem size={18} />
          </span>
          <div>
            <strong>D&D Toolkit</strong>
            <small>Campaign forge</small>
          </div>
        </div>
        <nav>
          <NavButton
            active={view === "dashboard"}
            icon={<Sparkles size={17} />}
            onClick={() => setView("dashboard")}
          >
            Overview
          </NavButton>
          <NavButton
            active={view === "npc"}
            icon={<WandSparkles size={17} />}
            onClick={() => setView("npc")}
          >
            NPC Generator
          </NavButton>
          <NavButton
            active={view === "monsters"}
            icon={<Swords size={17} />}
            onClick={() => setView("monsters")}
          >
            Monster Forge
          </NavButton>
          <NavButton
            active={view === "library"}
            icon={<Library size={17} />}
            onClick={() => setView("library")}
          >
            My Library <span className="nav-count">{saved.length}</span>
          </NavButton>
        </nav>
        <div className="sidebar-footer">
          <div className="online-dot" /> Open5e V2 connected
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">CAMPAIGN WORKSPACE</span>
            <h1>
              {view === "dashboard"
                ? "Shape your next story."
                : view === "npc"
                  ? "NPC Generator"
                  : view === "monsters"
                    ? "Monster Forge"
                    : "My Library"}
            </h1>
          </div>
          <button className="icon-button" title="Ajuda">
            <CircleHelp size={19} />
          </button>
        </header>
        {error && (
          <div className="alert">
            <X size={17} /> {error}
            <button onClick={() => location.reload()}>
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        )}
        {view === "dashboard" && <Dashboard saved={saved} setView={setView} />}
        {view === "npc" && (
          <NpcGenerator
            species={species}
            loading={loading}
            npc={npc}
            setNpc={setNpc}
            save={save}
          />
        )}
        {view === "monsters" && (
          <MonsterForge
            monsters={filteredMonsters}
            loading={loading}
            query={query}
            setQuery={setQuery}
            scaled={scaled}
            setScaled={setScaled}
            save={save}
          />
        )}
        {view === "library" && (
          <LibraryView
            saved={saved}
            setSaved={setSaved}
            directory={directory}
            openLibrary={openLibrary}
            query={query}
            setQuery={setQuery}
          />
        )}
      </main>
    </div>
  );
}

function NavButton({
  active,
  icon,
  children,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
      {active && <ChevronDown className="nav-chevron" size={14} />}
    </button>
  );
}
function Dashboard({
  saved,
  setView,
}: {
  saved: SavedSheet[];
  setView: (view: "npc" | "monsters" | "library") => void;
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
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
function QuickCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-card" onClick={onClick}>
      <span className="quick-icon">{icon}</span>
      <strong>{title}</strong>
      <span>{text}</span>
      <ChevronDown className="arrow" size={17} />
    </button>
  );
}

function NpcGenerator({
  species,
  loading,
  npc,
  setNpc,
  save,
}: {
  species: { key: string; name: string }[];
  loading: boolean;
  npc: Npc | null;
  setNpc: (npc: Npc) => void;
  save: (data: Npc, type: "npc") => void;
}) {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [level, setLevel] = useState("3");
  const [role, setRole] = useState("Wanderer");
  const generate = () => {
    const actualName =
      name.trim() || names[Math.floor(Math.random() * names.length)];
    const actualRace = race || species[0]?.name || "Human";
    const actualLevel = Number(level);
    setNpc({
      id: crypto.randomUUID(),
      name: actualName,
      race: actualRace,
      level: actualLevel,
      role,
      hitPoints: 8 + actualLevel * 5,
      armorClass: 10 + Math.ceil(actualLevel / 2),
      abilities: emptyAbilities(),
      traits: ["Reliable contact", "Knows the local roads"],
      source: "D&D Toolkit",
    });
  };
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
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Leave blank to roll a name"
            />
            <button
              title="Generate random name"
              onClick={() =>
                setName(names[Math.floor(Math.random() * names.length)])
              }
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </label>
        <label>
          Race
          <select
            value={race}
            onChange={(event) => setRace(event.target.value)}
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
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary full" onClick={generate}>
          <Sparkles size={17} /> Generate NPC
        </button>
        <p className="form-note">
          <Check size={14} /> Species data is sourced from Open5e V2
        </p>
      </section>
      {npc ? (
        <NpcCard npc={npc} onSave={() => save(npc, "npc")} />
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
function NpcCard({ npc, onSave }: { npc: Npc; onSave: () => void }) {
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

function MonsterForge({
  monsters,
  loading,
  query,
  setQuery,
  scaled,
  setScaled,
  save,
}: {
  monsters: Monster[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  scaled: Monster | null;
  setScaled: (monster: Monster | null) => void;
  save: (data: Monster, type: "monster") => void;
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
                  {levels.map((item) => (
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
                  onClick={() => save(scaled, "monster")}
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
function EmptyPreview({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="empty-preview">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}
function LibraryView({
  saved,
  setSaved,
  directory,
  openLibrary,
  query,
  setQuery,
}: {
  saved: SavedSheet[];
  setSaved: (sheets: SavedSheet[]) => void;
  directory: FileSystemDirectoryHandle | null;
  openLibrary: () => void;
  query: string;
  setQuery: (value: string) => void;
}) {
  const items = saved.filter((sheet) =>
    sheet.metadata.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="library-page">
      <div className="library-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your sheets..."
          />
        </div>
        <button className="secondary" onClick={openLibrary}>
          <FolderOpen size={16} />{" "}
          {directory ? "Library connected" : "Open local folder"}
        </button>
        <label className="secondary import-button">
          <Upload size={16} /> Import .a5e
          <input
            type="file"
            accept=".a5e,application/json"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const sheet = await importSheet(file);
                setSaved([
                  sheet,
                  ...saved.filter(
                    (item) => item.metadata.id !== sheet.metadata.id,
                  ),
                ]);
              } catch {
                window.alert("Este arquivo não é uma ficha .a5e válida.");
              }
            }}
          />
        </label>
      </div>
      <div className="library-head">
        <div>
          <span className="eyebrow">LOCAL COLLECTION</span>
          <h2>{directory ? "Connected library" : "Your campaign shelf"}</h2>
        </div>
        <span className="result-count">{items.length} sheets</span>
      </div>
      {items.length ? (
        <div className="saved-grid">
          {items.map((sheet) => (
            <article className="saved-card" key={sheet.metadata.id}>
              <span className={`saved-badge ${sheet.type}`}>
                {sheet.type === "npc" ? "NPC" : "MONSTER"}
              </span>
              <h3>{sheet.metadata.title}</h3>
              <p>
                {sheet.type === "npc"
                  ? `${(sheet.data as Npc).race} · level ${(sheet.data as Npc).level}`
                  : `${(sheet.data as Monster).type} · CR ${(sheet.data as Monster).challengeRating}`}
              </p>
              <div>
                <Heart size={15} /> <span>Saved locally</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyPreview
          icon={<FilePlus2 />}
          title="Your shelf is quiet"
          text="Save or import a sheet to see it here."
        />
      )}
    </section>
  );
}
export default App;
