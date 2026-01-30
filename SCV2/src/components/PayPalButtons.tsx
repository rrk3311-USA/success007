"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getPayPalClientId, getPayPalScriptUrl } from "@/lib/paypal-sdk";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => { render: (selector: string) => Promise<void> };
    };
  }
}

interface PayPalButtonsConfig {
  style?: { layout?: string; color?: string; shape?: string; label?: string; height?: number };
  createOrder: (data: unknown, actions: { order: { create: (opts: unknown) => Promise<string> } }) => Promise<string>;
  onApprove: (data: { orderID: string }, actions: { order: { capture: () => Promise<unknown> } }) => Promise<void>;
  onError?: (err: unknown) => void;
}

export interface PayPalButtonsProps {
  /** Total amount in USD (e.g. 29.99) */
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (details: unknown) => void;
  onError?: (err: unknown) => void;
}

export default function PayPalButtons({
  amount,
  currency = "USD",
  description = "Success Chemistry",
  onSuccess,
  onError,
}: PayPalButtonsProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const clientId = getPayPalClientId();
  const scriptUrl = getPayPalScriptUrl();

  useEffect(() => {
    if (!scriptLoaded || !clientId || !window.paypal) return;

    const inner = document.getElementById("paypal-button-container-inner");
    if (!inner) return;
    inner.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 55,
        },
        createOrder: (_data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: currency,
                  breakdown: {
                    item_total: {
                      currency_code: currency,
                      value: amount.toFixed(2),
                    },
                  },
                },
                description: description,
              },
            ],
            application_context: {
              shipping_preference: "GET_FROM_FILE",
            },
          }),
        onApprove: (_data, actions) =>
          actions.order.capture().then((details) => {
            onSuccess?.(details);
          }),
        onError: (err) => {
          onError?.(err);
        },
      })
      .render("#paypal-button-container-inner")
      .catch((err: unknown) => {
        onError?.(err);
      });
  }, [scriptLoaded, clientId, amount, currency, description, onSuccess, onError]);

  if (!clientId) {
    return (
      <p className="text-sm text-gray-500">
        Set <code className="bg-gray-100 px-1">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in .env.local (use Success Chemistry client ID from deploy-site/config.js).
      </p>
    );
  }

  if (!scriptUrl) return null;

  return (
    <>
      <Script
        src={scriptUrl}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div id="paypal-button-container" className="min-h-[55px]">
        <div id="paypal-button-container-inner" />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Secure checkout · PayPal, Venmo, Pay Later
      </p>
    </>
  );
}
