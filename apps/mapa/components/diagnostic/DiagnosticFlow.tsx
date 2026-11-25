
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildFlowSteps,
  countAnsweredQuestions,
  totalQuestions,
} from "@/lib/diagnostic/flow";
import type { DraftAnswer } from "@/lib/diagnostic/flow";
import { IntroScreen } from "./IntroScreen";
import { TransitionScreen } from "./TransitionScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ContactCapture } from "./ContactCapture";
import { Entrance } from "./Entrance";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

type Phase =
  | "intro"
  | "flow"
  | "submitting"
  | "contact"
  | "error";

interface ContactData {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
}

export function DiagnosticFlow(): React.JSX.Element {
  const router = useRouter();
  const steps = useMemo(() => buildFlowSteps(), []);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DraftAnswer>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);

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
          manychatSubscriberId:
            manychatSubscriberIdRef.current ?? undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudo guardar el diagnóstico.",
        );
      }

      if (!data.sessionId) {
        throw new Error("No se recibió el identificador del diagnóstico.");
      }

      setSessionId(data.sessionId);
      setPhase("contact");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error de conexión.",
      );
      setPhase("error");
    }
  }

  async function saveContact(contact: ContactData) {
    if (!sessionId || isSavingContact) return;

    setIsSavingContact(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/diagnostic/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fullName: contact.fullName,
          countryCode: contact.countryCode,
          phoneNumber: contact.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudieron guardar tus datos.",
        );
      }

      router.push(`/resultado/${sessionId}`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Error de conexión. Inténtalo nuevamente.",
      );
    } finally {
      setIsSavingContact(false);
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
          <p className="font-serif text-lg">
            Guardando tu diagnóstico...
          </p>
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

  if (phase === "contact") {
    return (
      <div className="relative min-h-screen">
        <AtmosphericBackground />

        <div className="relative z-10">
          {errorMessage && (
            <div className="mx-auto max-w-xl px-6 pt-8">
              <p
                role="alert"
                className="text-center text-sm text-amber-400"
              >
                {errorMessage}
              </p>
            </div>
          )}

          <div
            className={
              isSavingContact
                ? "pointer-events-none opacity-60"
                : ""
            }
            aria-busy={isSavingContact}
          >
            <ContactCapture onSubmit={saveContact} />
          </div>

          {isSavingContact && (
            <p className="pb-8 text-center text-sm text-foreground/60">
              Guardando tus datos...
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentStep = steps[stepIndex];

  const questionNumber = steps
    .slice(0, stepIndex + 1)
    .filter((s) => s.kind === "question").length;

  return (
    <div className="relative">
      <AtmosphericBackground />

      {!currentStep ? (
        <div className="flex min-h-screen items-center justify-center px-6 text-foreground">
          <p className="text-sm text-foreground/60">
            Algo salió mal. Recarga la página.
          </p>
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
          onAnswerChange={(answer) =>
            setAnswers((prev) => ({
              ...prev,
              [answer.questionId]: answer,
            }))
          }
          onContinue={advance}
          onBack={goBack}
          questionNumber={questionNumber}
          totalQuestions={total}
        />
      )}
    </div>
  );
}
