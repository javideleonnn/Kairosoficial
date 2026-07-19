import { Screen } from "@kairos/ui";
import { fetchDiagnosticSession } from "@/lib/result/fetchSession";
import { ResultReveal } from "@/components/result/ResultReveal";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultadoPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { sessionId } = await params;
  const session = await fetchDiagnosticSession(sessionId);

  if (!session) {
    return (
      <Screen>
        <div className="max-w-sm space-y-2 text-center">
          <h1 className="font-serif text-xl">No encontramos este diagnóstico</h1>
          <p className="text-sm text-foreground/50">
            El enlace puede estar incompleto o el diagnóstico ya no existe.
          </p>
        </div>
      </Screen>
    );
  }

  return <ResultReveal result={session.result} />;
}
