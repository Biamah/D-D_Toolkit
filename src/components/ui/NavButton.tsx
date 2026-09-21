import { ChevronDown } from "lucide-react";

export function NavButton({
  active,
  icon,
  children,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
      {active && <ChevronDown className="nav-chevron" size={14} />}
    </button>
  );
}
