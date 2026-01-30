/**
 * Medusa storefront client – SCV2 talks to your Medusa backend.
 * Set NEXT_PUBLIC_MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in .env
 */
const MEDUSA_BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test";

export const medusaConfig = {
  baseUrl: MEDUSA_BACKEND,
  publishableKey: PUBLISHABLE_KEY,
};

export function getMedusaBackendUrl(): string {
  return MEDUSA_BACKEND;
}

/** Medusa Admin URL – set NEXT_PUBLIC_MEDUSA_ADMIN_URL or derived from backend (:7001) */
export function getMedusaAdminUrl(): string {
  const envAdmin = process.env.NEXT_PUBLIC_MEDUSA_ADMIN_URL;
  if (envAdmin) return envAdmin;
  const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
  if (base) {
    try {
      const u = new URL(base);
      u.port = "7001";
      return u.toString();
    } catch {
      return "http://localhost:7001";
    }
  }
  return "http://localhost:7001";
}
