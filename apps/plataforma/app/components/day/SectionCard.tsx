interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
}: Props) {
  return (
    <section className="kairos-card mt-8 p-7">

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        {title}
      </p>

      <div className="kairos-divider my-5" />

      <div className="kairos-subtitle text-lg leading-9">

        {children}

      </div>

    </section>
  );
}