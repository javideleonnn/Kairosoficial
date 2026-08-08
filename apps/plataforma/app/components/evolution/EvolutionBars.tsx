export default function EvolutionBars() {
  const pillars = [
    {
      name: "Dirección",
      value: 32,
    },
    {
      name: "Disciplina",
      value: 18,
    },
    {
      name: "Identidad",
      value: 41,
    },
    {
      name: "Mentalidad",
      value: 27,
    },
    {
      name: "Acción",
      value: 36,
    },
  ];

  return (
    <section>

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        PILARES KAIROS
      </p>

      <div className="mt-5 space-y-4">

        {pillars.map((pillar) => (

          <div
            key={pillar.name}
            className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#131D2D] to-[#0D1523] p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {pillar.name}
              </h3>

              <span className="font-bold text-[var(--gold)]">
                {pillar.value}%
              </span>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className="gold-gradient h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pillar.value}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}