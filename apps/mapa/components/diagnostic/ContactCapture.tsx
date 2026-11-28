
"use client";

import { useMemo, useState } from "react";

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

const COUNTRY_DIAL_CODES = `
AF:93 AL:355 DE:49 AD:376 AO:244 AI:1264 AQ:672 AG:1268
SA:966 DZ:213 AR:54 AM:374 AW:297 AU:61 AT:43 AZ:994
BS:1242 BH:973 BD:880 BB:1246 BE:32 BZ:501 BJ:229 BM:1441
BY:375 BO:591 BA:387 BW:267 BR:55 BN:673 BG:359 BF:226
BI:257 BT:975 CV:238 KH:855 CM:237 CA:1 QA:974 TD:235
CL:56 CN:86 CY:357 CO:57 KM:269 CG:242 CD:243 KP:850
KR:82 CI:225 CR:506 HR:385 CU:53 CW:599 DK:45 DM:1767
EC:593 EG:20 SV:503 AE:971 ER:291 SK:421 SI:386 ES:34
US:1 EE:372 ET:251 PH:63 FI:358 FJ:679 FR:33 GA:241
GM:220 GE:995 GH:233 GI:350 GD:1473 GR:30 GL:299 GP:590
GU:1671 GT:502 GF:594 GG:44 GN:224 GQ:240 GW:245 GY:592
HT:509 HN:504 HK:852 HU:36 IN:91 ID:62 IQ:964 IR:98
IE:353 IS:354 IL:972 IT:39 JM:1876 JP:81 JE:44 JO:962
KZ:7 KE:254 KG:996 KI:686 KW:965 LA:856 LS:266 LV:371
LB:961 LR:231 LY:218 LI:423 LT:370 LU:352 MO:853
MK:389 MG:261 MY:60 MW:265 MV:960 ML:223 MT:356
MA:212 MQ:596 MR:222 MU:230 YT:262 MX:52 FM:691
MD:373 MC:377 MN:976 ME:382 MS:1664 MZ:258 MM:95
NA:264 NR:674 NP:977 NI:505 NE:227 NG:234 NU:683
NF:672 NO:47 NC:687 NZ:64 OM:968 NL:31 PK:92
PW:680 PS:970 PA:507 PG:675 PY:595 PE:51 PN:64
PF:689 PL:48 PT:351 PR:1787 GB:44 CF:236 CZ:420
DO:1809 RE:262 RW:250 RO:40 RU:7 EH:212 WS:685
AS:1684 BL:590 KN:1869 SM:378 MF:590 PM:508
VC:1784 SH:290 LC:1758 ST:239 SN:221 RS:381
SC:248 SL:232 SG:65 SX:1721 SY:963 SO:252 LK:94
SZ:268 ZA:27 SD:249 SS:211 SE:46 CH:41 SR:597
TH:66 TW:886 TZ:255 TJ:992 IO:246 TL:670 TG:228
TK:690 TO:676 TT:1868 TN:216 TM:993 TR:90
TV:688 UA:380 UG:256 UY:598 UZ:998 VU:678 VA:39
VE:58 VN:84 WF:681 YE:967 DJ:253 ZM:260 ZW:263
XK:383 AX:358 BQ:599 CC:61 CK:682 FO:298 FK:500
HM:672 IM:44 CX:61 KY:1345 MP:1670 MH:692
SB:677 TC:1649 VG:1284 VI:1340 UM:1
`;

function buildCountries(): Country[] {
  const regionNames = new Intl.DisplayNames(["es"], {
    type: "region",
  });

  const countryMap = new Map<string, Country>();

  const entries = COUNTRY_DIAL_CODES.trim().split(/\s+/);

  for (const entry of entries) {
    const parts = entry.split(":");
    const code = parts[0];
    const dial = parts[1];

    if (!code || !dial) continue;

    const country: Country = {
      code,
      dialCode: `+${dial}`,
      name: regionNames.of(code) ?? code,
    };

    countryMap.set(code, country);
  }

  return Array.from(countryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
}

const countries: Country[] = buildCountries();

export function ContactCapture({
  onSubmit,
  onBack,
}: ContactCaptureProps): React.JSX.Element {
  const [countryCode, setCountryCode] = useState("GT");
  const [search, setSearch] = useState("");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const selectedCountry = countries.find(
    (country) => country.code === countryCode,
  );

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        country.dialCode.includes(term) ||
        country.code.toLowerCase().includes(term),
    );
  }, [search]);

  function getFlag(code: string): string {
    return String.fromCodePoint(
      ...[...code.toUpperCase()].map(
        (char) => 127397 + char.charCodeAt(0),
      ),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (
      !fullName.trim() ||
      cleanPhone.length < 6 ||
      cleanPhone.length > 15 ||
      !selectedCountry
    ) {
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      countryCode: selectedCountry.dialCode,
      phoneNumber: cleanPhone,
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
                aria-expanded={isCountryListOpen}
                className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm transition hover:border-accent"
              >
                <span>
                  {selectedCountry
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

            <input
              type="tel"
              autoComplete="tel-national"
              required
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(
                  event.target.value.replace(/[^\d\s()-]/g, ""),
                )
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
              phoneNumber.replace(/\D/g, "").length < 6 ||
              phoneNumber.replace(/\D/g, "").length > 15 ||
              !selectedCountry
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

