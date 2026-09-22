import { useState } from "react";
import { AppShell, type View } from "./components/layout/AppShell";
import { useCampaignData } from "./hooks/useCampaignData";
import { useLocalLibrary } from "./hooks/useLocalLibrary";
import { DashboardRoute } from "./routes";
import { NpcRoute } from "./routes/npc";
import { MonstersRoute } from "./routes/monsters";
import { LibraryRoute } from "./routes/library";
import type { Monster, Npc } from "./types";
import { useTranslation } from "./hooks/useTranslation";

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [scaled, setScaled] = useState<Monster | null>(null);
  const { language } = useTranslation();
  const { species, filteredMonsters, loading, error } = useCampaignData(
    query,
    language,
  );
  const library = useLocalLibrary();

  const content =
    view === "dashboard" ? (
      <DashboardRoute saved={library.saved} setView={setView} />
    ) : view === "npc" ? (
      <NpcRoute
        species={species}
        loading={loading}
        onSave={(npc: Npc) => library.save(npc, "npc")}
      />
    ) : view === "monsters" ? (
      <MonstersRoute
        monsters={filteredMonsters}
        loading={loading}
        query={query}
        setQuery={setQuery}
        scaled={scaled}
        setScaled={setScaled}
        onSave={(monster: Monster) => library.save(monster, "monster")}
      />
    ) : (
      <LibraryRoute
        saved={library.saved}
        setSaved={library.setSaved}
        directory={library.directory}
        openLibrary={library.openLibrary}
        query={query}
        setQuery={setQuery}
        importSavedSheet={library.importSavedSheet}
      />
    );

  return (
    <AppShell view={view} setView={setView} saved={library.saved} error={error}>
      {content}
    </AppShell>
  );
}

export default App;
