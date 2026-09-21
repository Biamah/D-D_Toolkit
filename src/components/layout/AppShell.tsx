import {
  CircleHelp,
  Gem,
  Library,
  RefreshCw,
  Sparkles,
  Swords,
  WandSparkles,
  X,
} from "lucide-react";
import { NavButton } from "../ui/NavButton";
import type { SavedSheet } from "../../types";

export type View = "dashboard" | "npc" | "monsters" | "library";
export function AppShell({
  view,
  setView,
  saved,
  error,
  children,
}: {
  view: View;
  setView: (view: View) => void;
  saved: SavedSheet[];
  error: string;
  children: React.ReactNode;
}) {
  const title =
    view === "dashboard"
      ? "Shape your next story."
      : view === "npc"
        ? "NPC Generator"
        : view === "monsters"
          ? "Monster Forge"
          : "My Library";
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
            <h1>{title}</h1>
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
        {children}
      </main>
    </div>
  );
}
