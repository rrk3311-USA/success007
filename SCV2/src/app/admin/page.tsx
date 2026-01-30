"use client";

import Link from "next/link";
import { getMedusaAdminUrl } from "@/lib/medusa";
import { ROUTES } from "@/lib/constants";

export default function AdminPage() {
  const adminUrl = getMedusaAdminUrl();

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin</h1>
      <p className="text-gray-600 mb-6">
        Use the actual Medusa Admin dashboard to manage products, orders,
        payments (PayPal, Stripe, etc.), and settings.
      </p>
      <a
        href={adminUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      >
        Open Medusa Admin →
      </a>
      <p className="mt-4 text-sm text-gray-500">
        URL: <code className="bg-gray-100 px-1 rounded">{adminUrl}</code>
      </p>
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm font-medium text-amber-900 mb-1">
          This site can&apos;t be reached?
        </p>
        <p className="text-sm text-amber-800 mb-2">
          Nothing is running on port 7001. In a <strong>separate terminal</strong>, from the <strong>SCV2</strong> folder run:
        </p>
        <code className="block text-sm bg-white px-2 py-1 rounded border border-amber-200">
          npm run admin:sample
        </code>
        <p className="mt-2 text-sm text-amber-800">
          Leave that terminal open, then open{" "}
          <a href="http://localhost:7001" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            http://localhost:7001
          </a>
          . That runs a placeholder page so the link works without a full Medusa backend.
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        When your Medusa backend is running, Admin is usually on port{" "}
        <code>7001</code>. Configure PayPal and other payment providers in
        Medusa Admin under Settings → Payment providers.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-6 inline-block text-[#2854a6] font-medium hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
