import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, SAMPLE_PRODUCTS } from "@/data/sample-products";
import { ROUTES, SC } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Success Chemistry" };
  return {
    title: `${product.name} | Success Chemistry`,
    description: product.description ?? product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href={ROUTES.store}
        className="inline-block mb-8 text-[#2854a6] font-medium hover:underline text-sm"
      >
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gradient-to-br from-sky-50 to-white rounded-2xl overflow-hidden border border-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-contain p-6"
            unoptimized
            priority
          />
        </div>

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: SC.blue }}
          >
            {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold mb-6" style={{ color: SC.blue }}>
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>
          )}
          <button
            type="button"
            className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href={ROUTES.store}
          className="text-[#2854a6] font-medium hover:underline text-sm"
        >
          ← All products
        </Link>
      </div>
    </div>
  );
}
