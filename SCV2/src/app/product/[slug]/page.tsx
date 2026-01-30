import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";
import { ROUTES, SC } from "@/lib/constants";
import { sdk } from "@/lib/sdk";
import { BodyProse } from "@/components/BodyProse";

type Props = { params: Promise<{ slug: string }> };

type FallbackProduct = {
  sku: string;
  name: string;
  price: number;
  category?: string;
  short_description?: string;
  description?: string;
  suggested_use?: string;
  supplement_facts?: string;
  ingredients?: string;
  images: string[];
};

function getFallbackProductBySku(sku: string): FallbackProduct | null {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "success-3-products.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as { products?: FallbackProduct[] };
    return data.products?.find((p) => p.sku === sku) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await sdk.store.product.retrieve(slug);
    if (!product) return { title: "Product | Success Chemistry" };
    const title = (product as { title?: string | null }).title ?? (product as { handle?: string | null }).handle ?? slug;
    const desc = (product as { description?: string | null }).description ?? title;
    return { title: `${title} | Success Chemistry`, description: typeof desc === "string" ? desc : undefined };
  } catch {
    const fallback = getFallbackProductBySku(slug);
    if (fallback) return { title: `${fallback.name} | Success Chemistry`, description: fallback.short_description ?? fallback.description };
    return { title: "Product | Success Chemistry" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let fromMedusa: Record<string, unknown> | null = null;
  try {
    const res = await sdk.store.product.retrieve(slug);
    fromMedusa = res.product as Record<string, unknown>;
  } catch {
    // slug may be a SKU (fallback from store)
  }

  if (fromMedusa) {
    const title = (fromMedusa.title as string | null) ?? (fromMedusa.handle as string | null) ?? (fromMedusa.id as string);
    const description = fromMedusa.description as string | null | undefined;
    const thumbnail = fromMedusa.thumbnail as string | null | undefined;
    const images = (fromMedusa.images as Array<{ url?: string } | string> | undefined) ?? [];
    const firstImageUrl = thumbnail ?? (images[0] && (typeof images[0] === "string" ? images[0] : (images[0] as { url?: string }).url));
    const variants = (fromMedusa.variants as Array<{ id: string; prices?: Array<{ amount: number; currency_code?: string }> }> | undefined) ?? [];
    const price = variants[0]?.prices?.[0];
    const amount = price ? (price.amount / 100).toFixed(2) : "—";
    const currency = price?.currency_code ?? "USD";

    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href={ROUTES.store} className="inline-block mb-8 text-[#2854a6] font-medium hover:underline text-sm">← Back to shop</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 mb-4">
              {firstImageUrl ? (
                <Image src={firstImageUrl} alt={title} width={600} height={600} className="w-full h-full object-contain p-6" unoptimized />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400">No image</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.slice(0, 6).map((img, i) => {
                  const url = typeof img === "string" ? img : (img as { url?: string }).url;
                  if (!url) return null;
                  return (
                    <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <Image src={url} alt={`${title} view ${i + 1}`} width={56} height={56} className="w-full h-full object-contain" unoptimized />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-3xl font-bold mb-6" style={{ color: SC.blue }}>{currency} {amount}</p>
            {description && (
              <div className="text-gray-600 leading-relaxed mb-6"><BodyProse>{description}</BodyProse></div>
            )}
            <button type="button" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow">Add to cart</button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href={ROUTES.store} className="text-[#2854a6] font-medium hover:underline text-sm">← All products</Link>
        </div>
      </div>
    );
  }

  const fallback = getFallbackProductBySku(slug);
  if (!fallback) notFound();

  const firstImage = fallback.images?.[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href={ROUTES.store} className="inline-block mb-8 text-[#2854a6] font-medium hover:underline text-sm">← Back to shop</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 mb-4">
            {firstImage ? (
              <Image src={firstImage} alt={fallback.name} width={600} height={600} className="w-full h-full object-contain p-6" unoptimized />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-gray-400">No image</span>
            )}
          </div>
          {fallback.images && fallback.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {fallback.images.slice(0, 6).map((src, i) => (
                <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <Image src={src} alt={`${fallback.name} view ${i + 1}`} width={56} height={56} className="w-full h-full object-contain" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {fallback.category && (
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: SC.blue }}>{fallback.category}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{fallback.name}</h1>
          <p className="text-3xl font-bold mb-6" style={{ color: SC.blue }}>${fallback.price.toFixed(2)}</p>
          {(fallback.short_description ?? fallback.description) && (
            <div className="text-gray-600 leading-relaxed mb-6">
              <BodyProse>{fallback.short_description ?? fallback.description ?? ""}</BodyProse>
            </div>
          )}
          <button type="button" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow">Add to cart</button>
        </div>
      </div>
      {(fallback.description || fallback.suggested_use || fallback.supplement_facts || fallback.ingredients) && (
        <div className="mt-12 pt-8 border-t border-gray-200 space-y-8">
          {fallback.suggested_use && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Suggested use</h2>
              <p className="text-gray-600 whitespace-pre-line">{fallback.suggested_use}</p>
            </section>
          )}
          {fallback.ingredients && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h2>
              <p className="text-gray-600 text-sm">{fallback.ingredients}</p>
            </section>
          )}
          {fallback.supplement_facts && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Supplement facts</h2>
              <p className="text-gray-600 whitespace-pre-line text-sm">{fallback.supplement_facts}</p>
            </section>
          )}
        </div>
      )}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href={ROUTES.store} className="text-[#2854a6] font-medium hover:underline text-sm">← All products</Link>
      </div>
    </div>
  );
}
