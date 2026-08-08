  interface ActivityCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
  }

  export default function ActivityCard({
    title,
    value,
    subtitle,
  }: ActivityCardProps) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-white/50">
          {title}
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          {value}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm text-white/40">
            {subtitle}
          </p>
        )}
      </div>
    );
  }