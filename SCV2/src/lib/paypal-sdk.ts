/**
 * PayPal SDK script URL – same “cool dynamic” options as success project:
 * Venmo, Pay Later, funding-eligibility; credit disabled for cleaner UX.
 * Client ID from success: deploy-site/config.js (PRODUCTION_CLIENT_ID / SANDBOX_CLIENT_ID).
 */

const PAYPAL_SDK_BASE = "https://www.paypal.com/sdk/js";

export function getPayPalClientId(): string {
  return (
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    // Fallback: Success Chemistry production client ID (do not commit secrets; use .env)
    ""
  );
}

export function getPayPalScriptUrl(): string {
  const clientId = getPayPalClientId();
  if (!clientId) return "";

  const params = new URLSearchParams({
    "client-id": clientId,
    currency: "USD",
    intent: "capture",
    components: "buttons,funding-eligibility",
    "enable-funding": "venmo,paylater",
    "disable-funding": "credit",
  });

  return `${PAYPAL_SDK_BASE}?${params.toString()}`;
}
