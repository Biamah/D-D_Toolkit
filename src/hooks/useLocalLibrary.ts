import { useState } from "react";
import {
  connectLibrary,
  downloadSheet,
  importSheet,
  readLibrary,
} from "../lib/file-system/sheets";
import type { LibraryType, Npc, Monster, SavedSheet } from "../types";

export function useLocalLibrary() {
  const [saved, setSaved] = useState<SavedSheet[]>([]);
  const [directory, setDirectory] = useState<FileSystemDirectoryHandle | null>(
    null,
  );
  const save = (data: Npc | Monster, type: LibraryType) => {
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
  const importSavedSheet = async (file: File) => {
    const sheet = await importSheet(file);
    setSaved((items) => [
      sheet,
      ...items.filter((item) => item.metadata.id !== sheet.metadata.id),
    ]);
  };
  return { saved, setSaved, directory, save, openLibrary, importSavedSheet };
}
