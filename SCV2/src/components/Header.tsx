"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/**
 * Minimal header placeholder – rebuild with your own design.
 * Medusa has its own layout components; use those or replace this.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={ROUTES.home} className="font-semibold text-gray-900">
          Success Chemistry
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href={ROUTES.home} className="hover:text-gray-900">
            Home
          </Link>
          <Link href={ROUTES.store} className="hover:text-gray-900">
            Shop
          </Link>
          <Link href={ROUTES.blog} className="hover:text-gray-900">
            Blog
          </Link>
          <Link href={ROUTES.cart} className="hover:text-gray-900">
            Cart
          </Link>
          <Link href={ROUTES.admin} className="hover:text-gray-900">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
