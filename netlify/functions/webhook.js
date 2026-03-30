export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const webhookKey = process.env.WEBHOOK_KEY || "";
  const serverWebhookUrl = process.env.WEBHOOK_URL || "";

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  // Prefer the server-configured URL; fall back to the client-supplied URL.
  // Using the server URL when available prevents the function being used as an
  // open proxy to arbitrary destinations.
  const targetUrl = serverWebhookUrl || body.url || "";
  if (!targetUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: "Webhook URL is not configured. Please contact your administrator." }) };
  }

  // Only allow HTTPS requests to Microsoft Power Automate / Azure endpoints
  try {
    const parsed = new URL(targetUrl);
    const host = parsed.hostname;
    const isMicrosoftHost =
      host.endsWith(".logic.azure.com") ||
      host.endsWith(".api.powerplatform.com");
    if (parsed.protocol !== "https:" || !isMicrosoftHost) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL: must be an HTTPS Microsoft/Azure endpoint" }) };
    }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL: must be a valid HTTPS URL" }) };
  }

  const headers = { "Content-Type": "application/json" };
  if (webhookKey) {
    headers["api-key"] = webhookKey;
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
