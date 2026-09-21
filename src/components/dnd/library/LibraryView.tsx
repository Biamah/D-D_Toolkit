import { FilePlus2, FolderOpen, Heart, Search, Upload } from "lucide-react";
import { EmptyPreview } from "../../ui/EmptyPreview";
import type { Monster, Npc, SavedSheet } from "../../../types";
import { useTranslation } from "../../../hooks/useTranslation";

export function LibraryView({
  saved,
  setSaved,
  directory,
  openLibrary,
  query,
  setQuery,
  importSavedSheet,
}: {
  saved: SavedSheet[];
  setSaved: (sheets: SavedSheet[]) => void;
  directory: FileSystemDirectoryHandle | null;
  openLibrary: () => void;
  query: string;
  setQuery: (value: string) => void;
  importSavedSheet: (file: File) => Promise<void>;
}) {
  const { t } = useTranslation();
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
            placeholder={t("library.searchPlaceholder")}
          />
        </div>
        <button className="secondary" onClick={openLibrary}>
          <FolderOpen size={16} />{" "}
          {directory ? t("library.connected") : t("library.openFolder")}
        </button>
        <label className="secondary import-button">
          <Upload size={16} /> {t("library.import")}
          <input
            type="file"
            accept=".a5e,application/json"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                await importSavedSheet(file);
              } catch {
                window.alert(t("library.invalidFile"));
              }
            }}
          />
        </label>
      </div>
      <div className="library-head">
        <div>
          <span className="eyebrow">{t("library.collection")}</span>
          <h2>
            {directory ? t("library.connectedTitle") : t("library.shelfTitle")}
          </h2>
        </div>
        <span className="result-count">
          {t("library.sheets", { count: items.length })}
        </span>
      </div>
      {items.length ? (
        <div className="saved-grid">
          {items.map((sheet) => (
            <article className="saved-card" key={sheet.metadata.id}>
              <span className={`saved-badge ${sheet.type}`}>
                {sheet.type === "npc"
                  ? t("library.npcBadge")
                  : t("library.monsterBadge")}
              </span>
              <h3>{sheet.metadata.title}</h3>
              <p>
                {sheet.type === "npc"
                  ? `${(sheet.data as Npc).race} · ${t("npc.level").toLowerCase()} ${(sheet.data as Npc).level}`
                  : `${(sheet.data as Monster).type} · ${t("monster.cr")} ${(sheet.data as Monster).challengeRating}`}
              </p>
              <div>
                <Heart size={15} /> <span>{t("library.savedLocally")}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyPreview
          icon={<FilePlus2 />}
          title={t("library.emptyTitle")}
          text={t("library.emptyText")}
        />
      )}
    </section>
  );
}
