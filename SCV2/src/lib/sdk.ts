/**
 * Medusa JS SDK client for storefront. Used for products, cart, checkout.
 * No success-project UX – store UI is driven by Medusa API.
 */
import Medusa from "@medusajs/js-sdk";
import { medusaConfig } from "./medusa";

export const sdk = new Medusa({
  baseUrl: medusaConfig.baseUrl,
  publishableKey: medusaConfig.publishableKey,
});
