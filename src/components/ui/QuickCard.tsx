import { ChevronDown } from "lucide-react";

export function QuickCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-card" onClick={onClick}>
      <span className="quick-icon">{icon}</span>
      <strong>{title}</strong>
      <span>{text}</span>
      <ChevronDown className="arrow" size={17} />
    </button>
  );
}
