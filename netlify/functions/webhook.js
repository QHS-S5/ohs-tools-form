export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const webhookKey = process.env.WEBHOOK_KEY || "";
  const webhookUrl = process.env.WEBHOOK_URL || "";

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const targetUrl = body.url || webhookUrl;
  if (!targetUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: "No webhook URL configured" }) };
  }

  // Only allow requests to Power Automate / Logic Apps endpoints
  try {
    const parsed = new URL(targetUrl);
    if (!parsed.hostname.endsWith(".logic.azure.com")) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL" }) };
    }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL" }) };
  }

  const headers = { "Content-Type": "application/json" };
  if (webhookKey) {
    headers["x-qhs-key"] = webhookKey;
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body.data),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Webhook responded with ${response.status}: ${response.statusText}` }),
      };
    }

    const text = await response.text();
    return { statusCode: 200, body: text || JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
}
