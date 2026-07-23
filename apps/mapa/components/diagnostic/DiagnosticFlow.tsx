"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildFlowSteps, countAnsweredQuestions, totalQuestions } from "@/lib/diagnostic/flow";
import type { DraftAnswer } from "@/lib/diagnostic/flow";
import { IntroScreen } from "./IntroScreen";
import { TransitionScreen } from "./TransitionScreen";
import { QuestionScreen } from "./QuestionScreen";
import { Entrance } from "./Entrance";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

type Phase = "intro" | "flow" | "submitting" | "error";

/**
 * Orquestador del diagnóstico. La lógica de navegación (buildFlowSteps,
 * qué paso sigue, cuándo se envía) es la misma de siempre — se agregó
 * únicamente `goBack()`, porque la Imagen 3/4/5 muestra una flecha atrás
 * funcional en cada pregunta (no existía antes).
 */
export function DiagnosticFlow(): React.JSX.Element {
  const router = useRouter();
  const steps = useMemo(() => buildFlowSteps(), []);
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DraftAnswer>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const manychatSubscriberIdRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    manychatSubscriberIdRef.current = params.get("mc");
  }, []);

  const total = totalQuestions(steps);
  const answered = countAnsweredQuestions(steps, answers);

  async function submitDiagnostic() {
    setPhase("submitting");
    setErrorMessage(null);

    const startedAt = startedAtRef.current ?? Date.now();
    const durationSeconds = (Date.now() - startedAt) / 1000;

    try {
      const response = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.values(answers),
          startedAt: new Date(startedAt).toISOString(),
          durationSeconds,
          manychatSubscriberId: manychatSubscriberIdRef.current ?? undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error desconocido al guardar el diagnóstico.");
      }

      router.push(`/resultado/${data.sessionId}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error de red.");
      setPhase("error");
    }
  }

  function advance() {
    if (stepIndex + 1 >= steps.length) {
      void submitDiagnostic();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (phase === "intro") {
    return (
      <IntroScreen
        onStart={() => {
          startedAtRef.current = Date.now();
          setPhase("flow");
        }}
      />
    );
  }

  if (phase === "submitting") {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground">
        <AtmosphericBackground />
        <Entrance>
          <p className="font-serif text-lg">Guardando tu diagnóstico...</p>
        </Entrance>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-foreground">
        <AtmosphericBackground />
        <Entrance className="max-w-sm space-y-4 text-center">
          <p className="text-sm text-amber-400">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void submitDiagnostic()}
            className="rounded-full border border-accent px-6 py-2.5 text-sm text-accent"
          >
            Reintentar
          </button>
        </Entrance>
      </div>
    );
  }

  const currentStep = steps[stepIndex];

  // Número de pregunta (1-indexado, solo cuenta pasos "question", igual
  // que muestra la referencia — "6 / 12", no la posición entre los 14
  // pasos totales incluyendo transiciones).
  const questionNumber =
    steps.slice(0, stepIndex + 1).filter((s) => s.kind === "question").length;

  return (
    <div className="relative">
      <AtmosphericBackground />
      {!currentStep ? (
        <div className="flex min-h-screen items-center justify-center px-6 text-foreground">
          <p className="text-sm text-foreground/60">Algo salió mal. Recarga la página.</p>
        </div>
      ) : currentStep.kind === "transition" ? (
        <TransitionScreen
          key={currentStep.transition.afterQuestionId}
          transition={currentStep.transition}
          onContinue={advance}
          onBack={goBack}
        />
      ) : (
        <QuestionScreen
          key={currentStep.question.id}
          question={currentStep.question}
          answer={answers[currentStep.question.id]}
          onAnswerChange={(answer) => setAnswers((prev) => ({ ...prev, [answer.questionId]: answer }))}
          onContinue={advance}
          onBack={goBack}
          questionNumber={questionNumber}
          totalQuestions={total}
        />
      )}
    </div>
  );
}
