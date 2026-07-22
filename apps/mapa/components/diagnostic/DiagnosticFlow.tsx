"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, Button } from "@kairos/ui";
import { buildFlowSteps, countAnsweredQuestions, totalQuestions } from "@/lib/diagnostic/flow";
import type { DraftAnswer } from "@/lib/diagnostic/flow";
import { IntroScreen } from "./IntroScreen";
import { TransitionScreen } from "./TransitionScreen";
import { QuestionScreen } from "./QuestionScreen";
import { DiagnosticHeader } from "./DiagnosticHeader";

type Phase = "intro" | "flow" | "submitting" | "error";

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
      <Screen>
        <p className="font-serif text-lg">Guardando tu diagnóstico...</p>
      </Screen>
    );
  }

  if (phase === "error") {
    return (
      <Screen>
        <div className="max-w-sm space-y-4 text-center">
          <p className="text-sm text-amber-400">{errorMessage}</p>
          <Button onClick={() => void submitDiagnostic()}>Reintentar</Button>
        </div>
      </Screen>
    );
  }

  const currentStep = steps[stepIndex];

  // Contenedor persistente para toda la fase "flow" — el fondo (con blur,
  // costoso en móvil) se pinta UNA sola vez aquí y nunca se remonta entre
  // preguntas. Antes vivía dentro de QuestionScreen, que se remonta en cada
  // pregunta (key={question.id}) — recalcular un blur de 130px cada ~300ms
  // era la causa real del lag, no el número de preguntas ni la lógica.
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[130px]" />
      </div>

      <DiagnosticHeader answered={answered} total={total} />

      {!currentStep ? (
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="text-sm text-foreground/60">Algo salió mal. Recarga la página.</p>
        </div>
      ) : currentStep.kind === "transition" ? (
        <TransitionScreen
          key={currentStep.transition.afterQuestionId}
          transition={currentStep.transition}
          onContinue={advance}
        />
      ) : (
        <QuestionScreen
          key={currentStep.question.id}
          question={currentStep.question}
          answer={answers[currentStep.question.id]}
          onAnswerChange={(answer) =>
            setAnswers((prev) => ({ ...prev, [answer.questionId]: answer }))
          }
          onContinue={advance}
        />
      )}
    </div>
  );
}
