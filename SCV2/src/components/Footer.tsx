"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/**
 * Footer – same links as previous site (text only); new design.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600 border-b border-gray-200 pb-6 mb-6">
          <Link href={ROUTES.termsOfService} className="hover:text-gray-900">
            Terms of Service
          </Link>
          <Link href={ROUTES.shippingReturns} className="hover:text-gray-900">
            Shipping & Returns
          </Link>
          <Link href={ROUTES.paymentPolicy} className="hover:text-gray-900">
            Payment Policy
          </Link>
          <Link href={ROUTES.privacyPolicy} className="hover:text-gray-900">
            Privacy Policy
          </Link>
          <Link href={ROUTES.contact} className="hover:text-gray-900">
            Contact
          </Link>
          <Link href={ROUTES.store} className="hover:text-gray-900">
            Shop
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} Success Chemistry</span>
          <div className="flex items-center gap-6">
            <Link href={ROUTES.store} className="hover:text-gray-900">
              Shop
            </Link>
            <Link href={ROUTES.admin} className="hover:text-gray-900">
              Admin
            </Link>
            <a
              href="https://medusajs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              Medusa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
