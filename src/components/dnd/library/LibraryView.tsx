import { FilePlus2, FolderOpen, Heart, Search, Upload } from "lucide-react";
import { EmptyPreview } from "../../ui/EmptyPreview";
import type { Monster, Npc, SavedSheet } from "../../../types";

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
                await importSavedSheet(file);
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
