"use client";

import { Entrance } from "@/components/diagnostic/Entrance";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

interface WhatsAppCtaScreenProps {
  onBack: () => void;
}

const CHECKLIST = [
  "Revisaremos tu diagnóstico.",
  "Resolveré tus dudas.",
  "Te mostraré cuál es el siguiente paso para tu caso.",
];

/**
 * Diseño nuevo — editorial, más contenido, sin el ícono de órbitas
 * anterior. El checklist se integra como una lista numerada elegante en
 * vez de checks aislados; el CTA queda anclado abajo, y los 2 textos
 * pedidos (arriba del título / debajo del botón) se mantienen igual.
 */
export function WhatsAppCtaScreen({ onBack }: WhatsAppCtaScreenProps): React.JSX.Element {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50255612321";
  const message = encodeURIComponent("Hola, ya vi mi Mapa Kairos y quiero conversar sobre mi caso.");

  return (
    <div className="relative flex min-h-screen flex-col px-6 py-8 text-foreground">
      <AtmosphericBackground />

      <Entrance className="flex flex-1 flex-col">
        <div className="flex justify-center">
          <span className="flex items-center gap-2 rounded-full border border-accent/30 px-4 py-1.5 text-xs text-accent">
            <span aria-hidden>✓</span>
            Tu diagnóstico está listo
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-[19rem] text-center text-sm text-foreground/45">
          Ya invertiste unos minutos en descubrir qué está frenando tu crecimiento.
        </p>

        <h1 className="mt-5 text-center font-serif text-[28px] leading-[1.3]">
          Ahora es momento de
          <br />
          <span className="italic text-accent">construir el sistema</span>
          <br />
          que lo cambie.
        </h1>

        <p className="mx-auto mt-6 max-w-[20rem] text-center text-sm leading-relaxed text-foreground/50">
          El Mapa Kairos identifica el patrón. Ahora quiero ayudarte
          personalmente a romperlo.
        </p>

        <div className="mx-auto mt-10 w-full max-w-sm space-y-4 border-y border-foreground/10 py-6">
          {CHECKLIST.map((item, i) => (
            <div key={item} className="flex items-start gap-4">
              <span className="font-serif text-lg text-accent/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="pt-0.5 text-[15px] leading-snug text-foreground/85">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <p className="mb-4 text-center text-[15px]">
            Escríbeme por <span className="text-accent">WhatsApp</span> y conversemos sobre tu caso.
          </p>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-medium text-background"
          >
            Hablar por WhatsApp
            <span aria-hidden>→</span>
          </a>

          <p className="mx-auto mt-4 max-w-[20rem] text-center text-xs leading-relaxed text-foreground/40">
            Identificar el patrón es el primer paso. Cambiarlo es lo que realmente transforma tu vida.
          </p>

          <button type="button" onClick={onBack} className="mt-4 w-full text-center text-sm text-accent/80">
            Volver a mi resultado
          </button>
        </div>
      </Entrance>
    </div>
  );
}
