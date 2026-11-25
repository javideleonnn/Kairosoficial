
"use client";

import { useEffect, useMemo, useState } from "react";

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

interface ContactCaptureProps {
  onSubmit: (data: {
    fullName: string;
    countryCode: string;
    phoneNumber: string;
  }) => void;
  onBack?: () => void;
}

export function ContactCapture({
  onSubmit,
  onBack,
}: ContactCaptureProps): React.JSX.Element {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState("GT");
  const [search, setSearch] = useState("");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCountries() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );

        if (!response.ok) throw new Error("No se pudieron cargar los países");

        const data = await response.json();

        const formatted: Country[] = data
          .map((country: {
            name?: { common?: string };
            cca2?: string;
            idd?: { root?: string; suffixes?: string[] };
          }) => {
            const root = country.idd?.root ?? "";
            const suffix = country.idd?.suffixes?.[0] ?? "";

            return {
              name: country.name?.common ?? "",
              code: country.cca2 ?? "",
              dialCode: root + suffix,
            };
          })
          .filter(
            (country: Country) =>
              country.name && country.code && country.dialCode
          )
          .sort((a: Country, b: Country) =>
            a.name.localeCompare(b.name)
          );

        if (active) setCountries(formatted);
      } catch {
        if (active) setCountryError(true);
      } finally {
        if (active) setLoadingCountries(false);
      }
    }

    void loadCountries();

    return () => {
      active = false;
    };
  }, []);

  const selectedCountry = countries.find(
    (country) => country.code === countryCode
  );

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        country.dialCode.includes(term) ||
        country.code.toLowerCase().includes(term)
    );
  }, [countries, search]);

  function getFlag(code: string): string {
    return String.fromCodePoint(
      ...[...code.toUpperCase()].map(
        (char) => 127397 + char.charCodeAt(0)
      )
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !selectedCountry) {
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      countryCode: selectedCountry.dialCode,
      phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-12 text-foreground">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-9 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">
            MAPA KAIROS
          </p>

          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Tu diagnóstico está listo.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-foreground/60">
            Antes de revelar tu resultado, queremos saber cómo identificar tu
            diagnóstico y compartir contigo sus detalles.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm text-foreground/80"
            >
              ¿Cómo te llamas?
            </label>

            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-foreground/80">
              Tu WhatsApp
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryListOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm transition hover:border-accent"
              >
                <span>
                  {loadingCountries
                    ? "Cargando países..."
                    : selectedCountry
                      ? `${getFlag(selectedCountry.code)}  ${selectedCountry.name} (${selectedCountry.dialCode})`
                      : "Selecciona tu país"}
                </span>
                <span className="text-foreground/50">⌄</span>
              </button>

              {isCountryListOpen && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-hidden rounded-xl border border-white/15 bg-[#171717] shadow-2xl">
                  <input
                    autoFocus
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar país o código..."
                    className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />

                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setCountryCode(country.code);
                          setIsCountryListOpen(false);
                          setSearch("");
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/10"
                      >
                        {getFlag(country.code)} {country.name}{" "}
                        <span className="text-white/40">
                          ({country.dialCode})
                        </span>
                      </button>
                    ))}

                    {filteredCountries.length === 0 && (
                      <p className="px-4 py-4 text-sm text-white/50">
                        No encontramos ese país.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {countryError && (
              <p className="mt-2 text-xs text-amber-400">
                No pudimos cargar los países. Recarga la página e inténtalo de
                nuevo.
              </p>
            )}

            <input
              type="tel"
              autoComplete="tel-national"
              required
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value.replace(/[^\d\s()-]/g, ""))
              }
              placeholder="Tu número de WhatsApp"
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-accent"
            />
          </div>

          <p className="text-xs leading-6 text-foreground/45">
            Utilizaremos tus datos para identificar tu diagnóstico y poder
            contactarte en relación con tu resultado.
          </p>

          <button
            type="submit"
            disabled={
              !fullName.trim() ||
              !phoneNumber.trim() ||
              !selectedCountry ||
              loadingCountries
            }
            className="w-full rounded-full border border-accent bg-accent/10 px-6 py-3.5 text-sm tracking-wide text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Revelar mi resultado
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full text-center text-xs text-foreground/40 transition hover:text-foreground/70"
            >
              Volver
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
