/** Exibe uma mensagem orientativa quando ainda não há conteúdo para visualizar. */
export function EmptyPreview({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="empty-preview">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}
