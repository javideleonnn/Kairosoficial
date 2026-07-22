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
    body: JSON.stringify({ subscriber_id: subscriberId, field_id: fieldId, field_value: fieldValue }),
  });
}

async function sendFlow(config: ManyChatConfig, subscriberId: string): Promise<void> {
  const response = await fetch(`${MANYCHAT_API_BASE}/fb/sending/sendFlow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriber_id: subscriberId, flow_ns: config.flowNs }),
  });

  if (!response.ok) {
    throw new Error(`ManyChat sendFlow respondió ${response.status}`);
  }
}

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
