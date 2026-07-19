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
    // Se lee directo de window.location en vez de useSearchParams para no
    // forzar esta página (hoy estática) a requerir un boundary de Suspense.
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

      // La persistencia real vive en /resultado/[sessionId] — un refresh
      // ahí vuelve a cargar desde Supabase, no desde este estado en memoria.
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
  if (!currentStep) {
    return (
      <Screen>
        <p className="text-sm text-foreground/60">Algo salió mal. Recarga la página.</p>
      </Screen>
    );
  }

  return (
    <>
      <DiagnosticHeader answered={answered} total={total} />
      {currentStep.kind === "transition" ? (
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
    </>
  );
}
