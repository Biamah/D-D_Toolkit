import type { SavedSheet } from "../types";

export function downloadSheet(sheet: SavedSheet) {
  const blob = new Blob([JSON.stringify(sheet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${sheet.metadata.title.replace(/\s+/g, "-").toLowerCase()}.a5e`;
  anchor.click();
  URL.revokeObjectURL(url);
}
export async function importSheet(file: File): Promise<SavedSheet> {
  const data = JSON.parse(await file.text()) as SavedSheet;
  if (data.version !== 1 || !data.type || !data.data)
    throw new Error("Formato de ficha inválido");
  return data;
}
export async function connectLibrary(): Promise<FileSystemDirectoryHandle | null> {
  const picker = (
    window as Window & {
      showDirectoryPicker?: (options: {
        mode: "readwrite";
      }) => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker;
  if (!picker) return null;
  return picker({ mode: "readwrite" });
}
export async function readLibrary(
  handle: FileSystemDirectoryHandle,
): Promise<SavedSheet[]> {
  const sheets: SavedSheet[] = [];
  for await (const entry of handle.values()) {
    if (entry.kind !== "file" || !entry.name.endsWith(".a5e")) continue;
    try {
      const file = await entry.getFile();
      sheets.push(await importSheet(file));
    } catch {}
  }
  return sheets;
}
