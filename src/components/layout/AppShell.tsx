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
import { useTranslation } from "../../hooks/useTranslation";

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
  const { language, setLanguage, t } = useTranslation();
  const title =
    view === "dashboard"
      ? t("header.dashboard")
      : view === "npc"
        ? t("header.npc")
        : view === "monsters"
          ? t("header.monsters")
          : t("header.library");
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Gem size={18} />
          </span>
          <div>
            <strong>D&D Toolkit</strong>
            <small>{t("brand.subtitle")}</small>
          </div>
        </div>
        <nav>
          <NavButton
            active={view === "dashboard"}
            icon={<Sparkles size={17} />}
            onClick={() => setView("dashboard")}
          >
            {t("nav.overview")}
          </NavButton>
          <NavButton
            active={view === "npc"}
            icon={<WandSparkles size={17} />}
            onClick={() => setView("npc")}
          >
            {t("nav.npc")}
          </NavButton>
          <NavButton
            active={view === "monsters"}
            icon={<Swords size={17} />}
            onClick={() => setView("monsters")}
          >
            {t("nav.monsters")}
          </NavButton>
          <NavButton
            active={view === "library"}
            icon={<Library size={17} />}
            onClick={() => setView("library")}
          >
            {t("nav.library")} <span className="nav-count">{saved.length}</span>
          </NavButton>
        </nav>
        <div className="sidebar-footer">
          <div className="online-dot" /> {t("nav.dnd5eConnected")}
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">{t("header.workspace")}</span>
            <h1>{title}</h1>
          </div>
          <div className="header-actions">
            <label className="language-switcher">
              <span>{t("language.label")}</span>
              <select
                aria-label={t("language.label")}
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as "en" | "pt-BR")
                }
              >
                <option value="en">🇺🇸 {t("language.english")}</option>
                <option value="pt-BR">🇧🇷 {t("language.portuguese")}</option>
              </select>
            </label>
            <button className="icon-button" title={t("header.help")}>
              <CircleHelp size={19} />
            </button>
          </div>
        </header>
        {error && (
          <div className="alert">
            <X size={17} /> {error === "dnd5e" ? t("error.dnd5e") : error}
            <button onClick={() => location.reload()}>
              <RefreshCw size={15} /> {t("action.retry")}
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
