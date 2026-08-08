export default function Achievements() {
  const achievements = [
    {
      title: "Primer paso",
      unlocked: true,
      icon: "🥉",
    },
    {
      title: "3 días",
      unlocked: false,
      icon: "🥈",
    },
    {
      title: "7 días",
      unlocked: false,
      icon: "🥇",
    },
    {
      title: "21 días",
      unlocked: false,
      icon: "👑",
    },
  ];

  return (
    <section>

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        LOGROS
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">

        {achievements.map((item) => (
          <div
            key={item.title}
            className={`rounded-3xl border p-5 transition ${
              item.unlocked
                ? "border-[#D7B46A]/30 bg-[#151F30]"
                : "border-white/10 bg-[#101928] opacity-45"
            }`}
          >
            <div className="text-4xl">
              {item.icon}
            </div>

            <h3 className="mt-4 font-semibold">
              {item.title}
            </h3>

          </div>
        ))}

      </div>

    </section>
  );
}