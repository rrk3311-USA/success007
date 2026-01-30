"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sdk } from "@/lib/sdk";

type StoreProduct = {
  id: string;
  title: string | null;
  handle: string | null;
  thumbnail?: string | null;
  variants?: Array<{ id: string; prices?: Array<{ amount: number; currency_code?: string }> }>;
};

type FallbackProduct = { sku: string; name: string; price: number; category: string; images: string[] };

export function StoreProductsList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [fallbackProducts, setFallbackProducts] = useState<FallbackProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setFallbackProducts(null);
    sdk.store.product
      .list({ limit: 20, offset: 0 })
      .then(({ products: list }) => {
        if (!cancelled) {
          setProducts(list as StoreProduct[]);
          if (!list?.length) {
            fetch("/data/success-3-products.json")
              .then((r) => r.json())
              .then((data) => {
                if (!cancelled && data?.products?.length) setFallbackProducts(data.products);
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          fetch("/data/success-3-products.json")
            .then((r) => r.json())
            .then((data) => {
              if (!cancelled && data?.products?.length) setFallbackProducts(data.products);
            })
            .catch(() => setError("Could not load products or fallback data."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading products…</p>;
  }

  const showFallback = fallbackProducts && fallbackProducts.length > 0;
  const showMedusa = products.length > 0;

  if (showMedusa) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const price = p.variants?.[0]?.prices?.[0];
          const amount = price ? (price.amount / 100).toFixed(2) : "—";
          const currency = price?.currency_code ?? "USD";
          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="block rounded-xl overflow-hidden border border-gray-200 bg-white shadow hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                {p.thumbnail ? (
                  <Image src={p.thumbnail} alt={p.title ?? ""} fill className="object-contain" unoptimized />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{p.title ?? p.handle ?? p.id}</h3>
                <p className="mt-2 text-lg font-bold text-[#2854a6]">{currency} {amount}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  if (showFallback) {
    return (
      <>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
          Showing 3 products from fallback data. Run Medusa backend and seed it to use cart/checkout.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackProducts!.map((p) => (
            <Link
              key={p.sku}
              href={`/product/${p.sku}`}
              className="block rounded-xl overflow-hidden border border-gray-200 bg-white shadow hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-4" unoptimized />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2854a6] mb-1">{p.category}</p>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
                <p className="mt-2 text-lg font-bold text-[#2854a6]">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-medium">Could not load products</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">
          Run Medusa backend in <code className="bg-amber-100 px-1 rounded">medusa-backend</code> and seed with{" "}
          <code className="bg-amber-100 px-1 rounded">/data/success-3-products.json</code>, or ensure{" "}
          <code className="bg-amber-100 px-1 rounded">/data/success-3-products.json</code> exists.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">
      <p>No products. Add <code className="bg-gray-200 px-1 rounded">/data/success-3-products.json</code> or seed Medusa.</p>
    </div>
  );
}
