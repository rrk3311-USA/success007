"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Flask,
  ShoppingCart,
  User,
  Heart,
  Package,
} from "@phosphor-icons/react";
import { ProductCard } from "@/components/ProductCard";
import { SAMPLE_PRODUCTS } from "@/data/sample-products";

export default function PreviewPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Style guide: Medusa font + Phosphor icons
        </h1>
        <p className="text-gray-600 text-sm">
          Site uses Inter (Medusa font) and Phosphor icons. Product cards use
          the live <code className="text-xs bg-gray-100 px-1 rounded">ProductCard</code> component.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-[#2854a6] font-medium hover:underline text-sm"
        >
          ← Back to home
        </Link>
      </div>

      {/* Icons – Phosphor only (site standard) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Icons (Phosphor – site standard)
        </h2>
        <div className="rounded-lg border p-4 bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <Flask size={24} weight="fill" className="text-gray-700" />
            <ShoppingCart size={24} weight="fill" className="text-gray-700" />
            <User size={24} weight="fill" className="text-gray-700" />
            <Heart size={24} weight="fill" className="text-gray-700" />
            <Package size={24} weight="fill" className="text-gray-700" />
          </div>
        </div>
      </section>

      {/* Product cards – live ProductCard component */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Product cards (live style)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PRODUCTS.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              category={p.category}
              image={p.image}
            />
          ))}
        </div>
      </section>

      {/* Font (Medusa = Inter) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Font (Medusa = Inter)
        </h2>
        <div className="rounded-lg border p-4 bg-white">
          <p className="text-xl font-medium">
            Success Chemistry – Premium Supplements
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This page uses Inter via <code className="bg-gray-100 px-1 rounded">--font-medusa</code> (same as Medusa storefronts).
          </p>
        </div>
      </section>

      {/* Primary CTA button (live style) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Primary CTA
        </h2>
        <div className="rounded-lg border p-4 bg-gray-50">
          <button
            className={cn(
              "rounded-full bg-gradient-to-r from-blue-500 to-indigo-500",
              "text-white px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-shadow"
            )}
          >
            Add to cart
          </button>
        </div>
      </section>

      <Link
        href="/"
        className="inline-block mt-6 text-[#2854a6] font-medium hover:underline text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
