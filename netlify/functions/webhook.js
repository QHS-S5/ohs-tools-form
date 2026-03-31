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
    headers["x-qhs-key"] = webhookKey;
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body.data),
    });

    if (!response.ok) {
      let upstream = "";
      try { upstream = await response.text(); } catch { /* ignore */ }

      // Build a descriptive error for the client
      let error = `Webhook responded with ${response.status}: ${response.statusText}`;
      if (response.status === 401 || response.status === 403) {
        const keyConfigured = Boolean(webhookKey);
        error += keyConfigured
          ? ". An x-qhs-key header was sent but the endpoint rejected it — verify that WEBHOOK_KEY matches the key expected by your Power Automate flow."
          : ". No WEBHOOK_KEY environment variable is set — add it in your Netlify site settings under Environment Variables.";
      }
      if (upstream) {
        error += ` Upstream response: ${upstream.slice(0, 200)}`;
      }

      return {
        statusCode: response.status,
        body: JSON.stringify({ error }),
      };
    }

    const text = await response.text();
    return { statusCode: 200, body: text || JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
}
