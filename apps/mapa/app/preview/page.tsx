"use client";

import { useState } from "react";
import { QUESTIONS, TRANSITIONS } from "@kairos/scoring-engine";
import type { AletheiaResult } from "@kairos/scoring-engine";
import { IntroScreen } from "@/components/diagnostic/IntroScreen";
import { QuestionScreen } from "@/components/diagnostic/QuestionScreen";
import { TransitionScreen } from "@/components/diagnostic/TransitionScreen";
import { ResultReveal } from "@/components/result/ResultReveal";
import { WhatsAppCtaScreen } from "@/components/result/WhatsAppCtaScreen";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

/**
 * Ruta temporal de desarrollo — no forma parte del flujo real. Se
 * mantiene hasta aprobación visual explícita del diseño v3.
 */

const MOCK_RESULT: AletheiaResult = {
  resultCode: "DM-AS-N3",
  dominantBlock: "DM",
  secondaryBlock: "AS",
  isMixedProfile: false,
  blockScores: {
    FD: { blockKey: "FD", raw: 22, maxPossible: 30, normalized: 72 },
    IDE: { blockKey: "IDE", raw: 14, maxPossible: 30, normalized: 48 },
    DM: { blockKey: "DM", raw: 22, maxPossible: 27, normalized: 81 },
    AS: { blockKey: "AS", raw: 20, maxPossible: 31, normalized: 64 },
    VE: { blockKey: "VE", raw: 11, maxPossible: 31, normalized: 37 },
  },
  dimensionScores: { claridad: 40, accion: 28, confianza: 44, compromiso: 41 },
  indexScore: 38,
  level: { number: 2, name: "En Movimiento" },
  patterns: ["Tu progreso depende de sentirte inspirado, no de tu sistema."],
};

const singleSelectQuestion = QUESTIONS.find((q) => q.format === "single_select")!;
const scaleQuestionMock = QUESTIONS.find((q) => q.format === "scale")!;
const rankingQuestionMock = QUESTIONS.find((q) => q.format === "ranking")!;

type View = "menu" | "intro" | "q-single" | "q-scale" | "q-ranking" | "transition" | "result" | "cta";

export default function PreviewPage(): React.JSX.Element {
  const [view, setView] = useState<View>("menu");
  const back = () => setView("menu");

  if (view === "intro") return <WithBack onBack={back}><IntroScreen onStart={() => {}} /></WithBack>;
  if (view === "q-single")
    return (
      <WithBack onBack={back}>
        <QuestionScreen question={singleSelectQuestion} answer={undefined} onAnswerChange={() => {}} onContinue={() => {}} onBack={back} questionNumber={3} totalQuestions={12} />
      </WithBack>
    );
  if (view === "q-scale")
    return (
      <WithBack onBack={back}>
        <QuestionScreen question={scaleQuestionMock} answer={{ questionId: scaleQuestionMock.id, valueNumeric: 3 }} onAnswerChange={() => {}} onContinue={() => {}} onBack={back} questionNumber={6} totalQuestions={12} />
      </WithBack>
    );
  if (view === "q-ranking")
    return (
      <WithBack onBack={back}>
        <QuestionScreen question={rankingQuestionMock} answer={undefined} onAnswerChange={() => {}} onContinue={() => {}} onBack={back} questionNumber={9} totalQuestions={12} />
      </WithBack>
    );
  if (view === "transition") return <WithBack onBack={back}><TransitionScreen transition={TRANSITIONS[0]!} onContinue={() => {}} onBack={back} /></WithBack>;
  if (view === "result") return <WithBack onBack={back}><ResultReveal result={MOCK_RESULT} onRequestContact={() => setView("cta")} /></WithBack>;
  if (view === "cta") return <WithBack onBack={back}><WhatsAppCtaScreen onBack={() => setView("result")} /></WithBack>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-foreground">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/40">Preview — solo desarrollo</p>
      {(
        [
          ["intro", "Intro"],
          ["q-single", "Pregunta — Selección"],
          ["q-scale", "Pregunta — Escala"],
          ["q-ranking", "Pregunta — Ranking"],
          ["transition", "Transición"],
          ["result", "Resultado"],
          ["cta", "CTA WhatsApp"],
        ] as const
      ).map(([key, label]) => (
        <button key={key} onClick={() => setView(key)} className="w-full max-w-xs rounded-full border border-foreground/15 py-3 text-sm">
          {label}
        </button>
      ))}
    </main>
  );
}

function WithBack({ children, onBack }: { children: React.ReactNode; onBack: () => void }): React.JSX.Element {
  return (
    <div className="relative">
      <AtmosphericBackground />
      <button onClick={onBack} className="fixed bottom-4 right-4 z-50 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
        ← Menú
      </button>
      {children}
    </div>
  );
}
