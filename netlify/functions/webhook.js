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
  let isPowerPlatform = false;
  try {
    const parsed = new URL(targetUrl);
    const host = parsed.hostname;
    isPowerPlatform = host.endsWith(".api.powerplatform.com");
    const isLogicApps = host.endsWith(".logic.azure.com");
    const isMicrosoftHost = isPowerPlatform || isLogicApps;
    if (parsed.protocol !== "https:" || !isMicrosoftHost) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL: must be an HTTPS Microsoft/Azure endpoint" }) };
    }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid webhook URL: must be a valid HTTPS URL" }) };
  }

  const headers = { "Content-Type": "application/json" };

  // Determine which authentication header to use based on the URL
  const headerName = isPowerPlatform ? "api-key" : "x-qhs-key";

  // Build debug info about the authentication attempt
  const debugInfo = {
    targetHostname: new URL(targetUrl).hostname,
    detectedUrlType: isPowerPlatform ? "Power Platform" : "Logic Apps",
    authHeaderName: headerName,
    keyConfigured: Boolean(webhookKey),
    keyLength: webhookKey ? webhookKey.length : 0,
    keyPreview: webhookKey ? `${webhookKey.slice(0, 8)}...${webhookKey.slice(-4)}` : "NOT_SET",
    // Check for common issues
    keyHasWhitespace: webhookKey ? /\s/.test(webhookKey) : false,
    keyTrimmedLength: webhookKey ? webhookKey.trim().length : 0,
  };

  if (webhookKey) {
    // Power Platform direct invocation URLs use "api-key" header
    // Logic Apps URLs use custom "x-qhs-key" header for flow-level validation
    headers[headerName] = webhookKey;
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

      // Build a descriptive error for the client with debug info
      let error = `Webhook responded with ${response.status}: ${response.statusText}`;
      if (response.status === 401 || response.status === 403) {
        error += debugInfo.keyConfigured
          ? `. A ${debugInfo.authHeaderName} header was sent but the endpoint rejected it — verify that WEBHOOK_KEY matches the key expected by your Power Automate flow.`
          : `. No WEBHOOK_KEY environment variable is set — add it in your Netlify site settings under Environment Variables.`;
      }
      if (upstream) {
        error += ` Upstream response: ${upstream.slice(0, 200)}`;
      }

      // Add detailed debugging information
      const debugDetails = {
        hostname: debugInfo.targetHostname,
        urlType: debugInfo.detectedUrlType,
        headerSent: debugInfo.authHeaderName,
        keyConfigured: debugInfo.keyConfigured,
        keyLength: debugInfo.keyLength,
        keyPreview: debugInfo.keyPreview,
        hasWhitespace: debugInfo.keyHasWhitespace,
        trimmedLength: debugInfo.keyTrimmedLength,
        lengthMismatch: debugInfo.keyLength !== debugInfo.keyTrimmedLength,
      };

      return {
        statusCode: response.status,
        body: JSON.stringify({
          error,
          debug: debugDetails,
        }),
      };
    }

    const text = await response.text();
    return { statusCode: 200, body: text || JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
}
