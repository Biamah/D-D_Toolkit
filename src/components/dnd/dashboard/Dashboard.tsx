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
import { useTranslation } from "../../../hooks/useTranslation";

export function Dashboard({
  saved,
  setView,
}: {
  saved: SavedSheet[];
  setView: (view: View) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <section className="hero-panel">
        <div>
          <span className="eyebrow warm">{t("dashboard.eyebrow")}</span>
          <h2>
            {t("dashboard.heroTitle")}
            <br />
            <em>{t("dashboard.heroEmphasis")}</em>
          </h2>
          <p>{t("dashboard.heroText")}</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setView("npc")}>
              <WandSparkles size={17} /> {t("dashboard.createNpc")}
            </button>
            <button className="secondary" onClick={() => setView("monsters")}>
              <Swords size={17} /> {t("dashboard.forgeMonster")}
            </button>
          </div>
        </div>
        <div className="sigil">
          <span>✦</span>
          <small>
            {t("dashboard.sigil").split("|")[0]}
            <br />
            {t("dashboard.sigil").split("|")[1]}
          </small>
        </div>
      </section>
      <section className="stats-grid">
        <Stat
          label={t("dashboard.savedSheets")}
          value={String(saved.length).padStart(2, "0")}
          icon={<BookOpen size={19} />}
        />
        <Stat
          label={t("dashboard.open5eCreatures")}
          value="—"
          icon={<Swords size={19} />}
        />
        <Stat
          label={t("dashboard.localFirst")}
          value="100%"
          icon={<FolderOpen size={19} />}
        />
      </section>
      <section className="section-heading">
        <div>
          <span className="eyebrow">{t("dashboard.quickStart")}</span>
          <h3>{t("dashboard.chooseMove")}</h3>
        </div>
      </section>
      <div className="quick-grid">
        <QuickCard
          icon={<WandSparkles />}
          title={t("dashboard.makeNpc")}
          text={t("dashboard.makeNpcText")}
          onClick={() => setView("npc")}
        />
        <QuickCard
          icon={<Swords />}
          title={t("dashboard.balanceMonster")}
          text={t("dashboard.balanceMonsterText")}
          onClick={() => setView("monsters")}
        />
        <QuickCard
          icon={<Library />}
          title={t("dashboard.openLibrary")}
          text={t("dashboard.openLibraryText")}
          onClick={() => setView("library")}
        />
      </div>
    </>
  );
}
