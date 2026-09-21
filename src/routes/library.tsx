import { LibraryView } from "../components/dnd/library/LibraryView";
import type { SavedSheet } from "../types";
export function LibraryRoute(props: {
  saved: SavedSheet[];
  setSaved: (sheets: SavedSheet[]) => void;
  directory: FileSystemDirectoryHandle | null;
  openLibrary: () => void;
  query: string;
  setQuery: (value: string) => void;
  importSavedSheet: (file: File) => Promise<void>;
}) {
  return <LibraryView {...props} />;
}
