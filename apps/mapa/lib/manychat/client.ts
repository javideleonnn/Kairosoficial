/**
 * Cliente mínimo de la API de ManyChat. Endpoints y formas de payload
 * verificados contra la documentación real de ManyChat (api.manychat.com),
 * no inventados — ver notas de cada función.
 *
 * Todo esto es "fire and forget" desde el punto de vista del usuario: si
 * ManyChat falla o no está configurado, el diagnóstico del usuario NUNCA
 * se ve afectado — solo se registra el error.
 */

const MANYCHAT_API_BASE = "https://api.manychat.com";

interface ManyChatConfig {
  apiToken: string;
  flowNs: string;
}

function getConfig(): ManyChatConfig | null {
  const apiToken = process.env.MANYCHAT_API_TOKEN;
  const flowNs = process.env.MANYCHAT_FLOW_NS;
  if (!apiToken || !flowNs) return null;
  return { apiToken, flowNs };
}

/**
 * Setea un custom field del subscriber ANTES de disparar el flow — sendFlow
 * no acepta datos dinámicos de forma confiable (reportado en la comunidad
 * de ManyChat), así que los datos deben existir como custom field primero
 * para que el flow los muestre vía {{nombre_del_campo}}.
 */
async function setCustomField(
  config: ManyChatConfig,
  subscriberId: string,
  fieldId: string,
  fieldValue: string,
): Promise<void> {
  await fetch(`${MANYCHAT_API_BASE}/fb/subscriber/setCustomField`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      field_id: fieldId,
      field_value: fieldValue,
    }),
  });
}

async function sendFlow(config: ManyChatConfig, subscriberId: string): Promise<void> {
  const response = await fetch(`${MANYCHAT_API_BASE}/fb/sending/sendFlow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      flow_ns: config.flowNs,
    }),
  });

  if (!response.ok) {
    throw new Error(`ManyChat sendFlow respondió ${response.status}`);
  }
}

/**
 * Notifica a ManyChat que un diagnóstico se completó — setea los custom
 * fields configurados (el negocio los crea en su cuenta de ManyChat y
 * provee los field_id vía env vars) y dispara el flow de seguimiento.
 * Nunca lanza — cualquier error se atrapa y se loguea, el diagnóstico del
 * usuario no depende de esto.
 */
export async function notifyManyChatOfCompletedDiagnostic(params: {
  subscriberId: string;
  resultCode: string;
  dominantBlockName: string;
}): Promise<{ sent: boolean; error?: string }> {
  const config = getConfig();
  if (!config) {
    return { sent: false, error: "ManyChat no está configurado (faltan env vars)." };
  }

  try {
    const resultFieldId = process.env.MANYCHAT_FIELD_ID_RESULT_CODE;
    const blockFieldId = process.env.MANYCHAT_FIELD_ID_DOMINANT_BLOCK;

    if (resultFieldId) {
      await setCustomField(config, params.subscriberId, resultFieldId, params.resultCode);
    }
    if (blockFieldId) {
      await setCustomField(config, params.subscriberId, blockFieldId, params.dominantBlockName);
    }

    await sendFlow(config, params.subscriberId);
    return { sent: true };
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : "Error desconocido." };
  }
}
