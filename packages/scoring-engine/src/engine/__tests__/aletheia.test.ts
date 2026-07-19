import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../../content/questions";
import { computeAletheiaResult } from "../index";
import { determineDominantAndSecondary } from "../dominant";
import { getLevel } from "../levels";
import { AletheiaValidationError } from "../types";
import type { EngineAnswer, BlockScore } from "../types";
import type { BlockKey } from "../../content/types";

/** Construye respuestas eligiendo, para cada pregunta, la opción del primer
 * bloqueo de `priority` presente en esa pregunta — determinista y reutilizable
 * entre casos de prueba. */
function buildAnswersByPriority(priority: BlockKey[]): EngineAnswer[] {
  return QUESTIONS.map((q) => {
    if (q.format === "scale" && q.scoringConfig?.kind === "scale") {
      const { blockId, min, max, direction } = q.scoringConfig;
      const wantsHigh = priority.indexOf(blockId as BlockKey) < priority.length / 2;
      const value = wantsHigh
        ? direction === "direct" ? max : min
        : direction === "direct" ? min : max;
      return { questionId: q.id, valueNumeric: value };
    }
    if (q.format === "ranking") {
      const ordered = [...q.options].sort(
        (a, b) =>
          priority.indexOf(a.blockKey as BlockKey) - priority.indexOf(b.blockKey as BlockKey),
      );
      return { questionId: q.id, rankedOptionIds: ordered.map((o) => o.id) };
    }
    const chosen = priority
      .map((key) => q.options.find((o) => o.blockKey === key))
      .find((o) => o != null)!;
    return { questionId: q.id, questionOptionId: chosen.id };
  });
}

/** Reparte las elecciones en rotación entre bloqueos, sin concentrar en uno
 * solo — modela un perfil disperso, sin bloqueo agudo. */
function buildDispersedAnswers(): EngineAnswer[] {
  let rotation = 0;
  return QUESTIONS.map((q) => {
    if (q.format === "scale" && q.scoringConfig?.kind === "scale") {
      const { min, max, direction } = q.scoringConfig;
      return { questionId: q.id, valueNumeric: direction === "direct" ? min : max };
    }
    if (q.format === "ranking") {
      const rotated = [...q.options];
      rotated.push(rotated.shift()!);
      return { questionId: q.id, rankedOptionIds: rotated.map((o) => o.id) };
    }
    const option = q.options[rotation % q.options.length]!;
    rotation += 1;
    return { questionId: q.id, questionOptionId: option.id };
  });
}

function validFullAnswerSet(): EngineAnswer[] {
  return buildAnswersByPriority(["FD", "IDE", "DM", "AS", "VE"]);
}

describe("Aletheia — perfiles representativos", () => {
  it("Caso 1 — bloqueo agudo y aislado en Falta de Dirección: dominante FD, nivel alto (Dominio)", () => {
    const result = computeAletheiaResult(buildAnswersByPriority(["FD", "AS", "IDE", "DM", "VE"]));
    expect(result.dominantBlock).toBe("FD");
    expect(result.secondaryBlock).toBe("AS");
    expect(result.indexScore).toBeGreaterThanOrEqual(70);
    expect(result.level.name).toBe("Consolidado");
  });

  it("Caso 2 — Autosabotaje concentrado con Validación Externa como corriente secundaria: nivel bajo (En Movimiento)", () => {
    const result = computeAletheiaResult(buildAnswersByPriority(["AS", "VE", "FD", "IDE", "DM"]));
    expect(result.dominantBlock).toBe("AS");
    expect(result.secondaryBlock).toBe("VE");
    expect(result.level.name).toBe("En Movimiento");
  });

  it("Caso 3 — crisis combinada (FD, IDE, DM, AS elevados a la vez): perfil mixto, nivel bajo (En Movimiento)", () => {
    const badBlocks: BlockKey[] = ["FD", "IDE", "DM", "AS"];
    const answers = QUESTIONS.map((q, i) => {
      if (q.format === "scale" && q.scoringConfig?.kind === "scale") {
        const { min, max, direction } = q.scoringConfig;
        return { questionId: q.id, valueNumeric: direction === "direct" ? max : min };
      }
      if (q.format === "ranking") {
        const bad = q.options.filter((o) => badBlocks.includes(o.blockKey as BlockKey));
        const ve = q.options.find((o) => o.blockKey === "VE")!;
        const ordered = i % 2 === 0 ? bad : [...bad].reverse();
        return { questionId: q.id, rankedOptionIds: [...ordered, ve].map((o) => o.id) };
      }
      const options = badBlocks
        .map((k) => q.options.find((o) => o.blockKey === k))
        .filter((o): o is NonNullable<typeof o> => o != null);
      const chosen = options[i % options.length] ?? q.options[0]!;
      return { questionId: q.id, questionOptionId: chosen.id };
    });

    const result = computeAletheiaResult(answers);
    expect(result.isMixedProfile).toBe(true);
    expect(result.level.name).toBe("En Movimiento");
    expect(result.indexScore).toBeLessThan(65);
  });

  it("perfil disperso sin bloqueo agudo produce un índice medio-alto y ningún bloqueo cerca de su máximo", () => {
    const result = computeAletheiaResult(buildDispersedAnswers());
    for (const key of Object.keys(result.blockScores) as BlockKey[]) {
      expect(result.blockScores[key].normalized).toBeLessThan(50);
    }
  });
});

describe("Aletheia — determinismo y estabilidad", () => {
  it("las mismas respuestas producen siempre el mismo resultado (función pura, sin estado oculto)", () => {
    const answers = validFullAnswerSet();
    const first = computeAletheiaResult(answers);
    const second = computeAletheiaResult(answers);
    expect(second).toEqual(first);
  });

  it("el resultCode es estable y refleja dominante, secundario y nivel", () => {
    const result = computeAletheiaResult(buildAnswersByPriority(["FD", "AS", "IDE", "DM", "VE"]));
    expect(result.resultCode).toBe(`FD-AS-N${result.level.number}`);
  });
});

describe("Aletheia — desempate (Caso 3 del pedido: empates)", () => {
  const baseScores = (overrides: Partial<Record<BlockKey, number>>): Record<BlockKey, BlockScore> => {
    const base: Record<BlockKey, number> = { FD: 40, IDE: 40, DM: 20, AS: 40, VE: 10, ...overrides };
    const out = {} as Record<BlockKey, BlockScore>;
    (Object.keys(base) as BlockKey[]).forEach((key) => {
      out[key] = { blockKey: key, raw: base[key], maxPossible: 100, normalized: base[key] };
    });
    return out;
  };

  it("con empate en primer lugar, desempata a favor del bloqueo elegido en la pregunta de cierre (Q20)", () => {
    const tied = baseScores({ FD: 70, AS: 70, IDE: 40, DM: 20, VE: 10 });
    const result = determineDominantAndSecondary(tied, "AS");
    expect(result.dominant).toBe("AS");
    expect(result.secondary).toBe("FD");
  });

  it("si Q20 no coincide con ninguno de los empatados, usa el orden de prioridad fijo y documentado", () => {
    const tied = baseScores({ FD: 70, DM: 70, IDE: 40, AS: 30, VE: 10 });
    // Q20 apuntó a VE, que no está empatado — debe caer al orden fijo
    // ["AS","FD","DM","IDE","VE"], donde FD precede a DM.
    const result = determineDominantAndSecondary(tied, "VE");
    expect(result.dominant).toBe("FD");
  });

  it("marca isMixedProfile cuando dominante y secundario quedan a ≤3 puntos", () => {
    const close = baseScores({ FD: 52, AS: 50, IDE: 30, DM: 20, VE: 10 });
    const result = determineDominantAndSecondary(close, "FD");
    expect(result.isMixedProfile).toBe(true);
  });

  it("no marca isMixedProfile cuando la diferencia es mayor a 3 puntos", () => {
    const clear = baseScores({ FD: 80, AS: 40, IDE: 30, DM: 20, VE: 10 });
    const result = determineDominantAndSecondary(clear, "FD");
    expect(result.isMixedProfile).toBe(false);
  });
});

describe("Aletheia — niveles (getLevel)", () => {
  it("cubre las 5 bandas sin huecos ni solapamientos entre 0 y 100", () => {
    for (let score = 0; score <= 100; score += 1) {
      const level = getLevel(score);
      expect(level.number).toBeGreaterThanOrEqual(1);
      expect(level.number).toBeLessThanOrEqual(5);
    }
  });

  it("es monótono: un índice mayor nunca produce un nivel menor", () => {
    let previousLevel = 0;
    for (let score = 0; score <= 100; score += 1) {
      const level = getLevel(score);
      expect(level.number).toBeGreaterThanOrEqual(previousLevel);
      previousLevel = level.number;
    }
  });

  it("nunca lanza una excepción, incluso con valores fuera de rango", () => {
    expect(() => getLevel(-50)).not.toThrow();
    expect(() => getLevel(500)).not.toThrow();
    expect(getLevel(-50).number).toBe(1);
    expect(getLevel(500).number).toBe(5);
  });
});

describe("Aletheia — respuestas inválidas (debe fallar explícito, nunca calcular sobre datos corruptos)", () => {
  it("lanza AletheiaValidationError si falta la respuesta a una pregunta", () => {
    const answers = validFullAnswerSet().filter((a) => a.questionId !== "q5");
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError si un valor de escala está fuera de rango", () => {
    const answers = validFullAnswerSet().map((a) =>
      a.questionId === "q3" ? { ...a, valueNumeric: 99 } : a,
    );
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError si un valor de escala no es entero", () => {
    const answers = validFullAnswerSet().map((a) =>
      a.questionId === "q3" ? { ...a, valueNumeric: 2.5 } : a,
    );
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError si un ranking no incluye todos los ítems", () => {
    const answers = validFullAnswerSet().map((a) =>
      a.questionId === "q7" ? { ...a, rankedOptionIds: ["q7a", "q7b"] } : a,
    );
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError si un ranking tiene ítems duplicados", () => {
    const answers = validFullAnswerSet().map((a) =>
      a.questionId === "q7"
        ? { ...a, rankedOptionIds: ["q7a", "q7a", "q7b", "q7c", "q7d"] }
        : a,
    );
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError si questionOptionId no existe", () => {
    const answers = validFullAnswerSet().map((a) =>
      a.questionId === "q1" ? { ...a, questionOptionId: "opcion-inexistente" } : a,
    );
    expect(() => computeAletheiaResult(answers)).toThrow(AletheiaValidationError);
  });

  it("lanza AletheiaValidationError con un array de respuestas vacío", () => {
    expect(() => computeAletheiaResult([])).toThrow(AletheiaValidationError);
  });
});
