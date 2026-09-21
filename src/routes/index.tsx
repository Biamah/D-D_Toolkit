import { Dashboard } from "../components/dnd/dashboard/Dashboard";
import type { SavedSheet } from "../types";
import type { View } from "../components/layout/AppShell";
export function DashboardRoute({
  saved,
  setView,
}: {
  saved: SavedSheet[];
  setView: (view: View) => void;
}) {
  return <Dashboard saved={saved} setView={setView} />;
}
