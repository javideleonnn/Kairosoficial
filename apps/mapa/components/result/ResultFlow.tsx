"use client";

import { useState } from "react";
import type { AletheiaResult } from "@kairos/scoring-engine";
import { ResultReveal } from "./ResultReveal";
import { WhatsAppCtaScreen } from "./WhatsAppCtaScreen";

interface ResultFlowProps {
  result: AletheiaResult;
}

/** Conecta Resultado → CTA WhatsApp (la 7ª pantalla nueva). */
export function ResultFlow({ result }: ResultFlowProps): React.JSX.Element {
  const [showContact, setShowContact] = useState(false);

  if (showContact) {
    return <WhatsAppCtaScreen onBack={() => setShowContact(false)} />;
  }

  return <ResultReveal result={result} onRequestContact={() => setShowContact(true)} />;
}
