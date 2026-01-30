import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, SAMPLE_PRODUCTS } from "@/data/sample-products";
import { ROUTES, SC } from "@/lib/constants";
import { getProductImagePath } from "@/lib/image-paths";
import { BodyProse } from "@/components/BodyProse";

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
    description: product.short_description ?? product.description ?? product.name,
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
        <div>
          <div className="aspect-square bg-gradient-to-br from-sky-50 to-white rounded-2xl overflow-hidden border border-gray-100 mb-4">
            {/* Large image only on desktop/tablet (md+); mobile gets smaller file */}
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={getProductImagePath(product.image, "mobile")}
              />
              <img
                src={getProductImagePath(product.image, "large")}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain p-6"
                fetchPriority="high"
              />
            </picture>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  <Image
                    src={getProductImagePath(src, "mobile")}
                    alt={`${product.name} view ${i + 1}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
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
          {(product.short_description ?? product.description) && (
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.short_description ?? product.description}
            </p>
          )}
          {(product.sku || product.upc || product.gtin || product.weight || product.dimensions) && (
            <dl className="text-sm text-gray-600 mb-6 space-y-1">
              {product.sku && (
                <>
                  <dt className="inline font-medium text-gray-500">SKU </dt>
                  <dd className="inline">{product.sku}</dd>
                  <br />
                </>
              )}
              {product.upc && (
                <>
                  <dt className="inline font-medium text-gray-500">UPC </dt>
                  <dd className="inline">{product.upc}</dd>
                  <br />
                </>
              )}
              {product.gtin && (
                <>
                  <dt className="inline font-medium text-gray-500">GTIN </dt>
                  <dd className="inline">{product.gtin}</dd>
                  <br />
                </>
              )}
              {product.weight && (
                <>
                  <dt className="inline font-medium text-gray-500">Weight </dt>
                  <dd className="inline">{product.weight}</dd>
                  <br />
                </>
              )}
              {product.dimensions && (
                <>
                  <dt className="inline font-medium text-gray-500">Dimensions </dt>
                  <dd className="inline">{product.dimensions}</dd>
                </>
              )}
            </dl>
          )}
          <button
            type="button"
            className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
          >
            Add to cart
          </button>
        </div>
      </div>

      {(product.description ||
        product.suggested_use ||
        product.supplement_facts ||
        product.ingredients ||
        (product.faqs && product.faqs.length > 0)) && (
        <div className="mt-12 pt-8 border-t border-gray-200 space-y-8">
          {product.description && product.description !== product.short_description && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>
              <BodyProse className="text-gray-600">
                {product.description.split(/\n\n+/).map((p, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </BodyProse>
            </section>
          )}
          {product.suggested_use && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Suggested use</h2>
              <p className="text-gray-600 whitespace-pre-line">{product.suggested_use}</p>
            </section>
          )}
          {product.ingredients && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h2>
              <p className="text-gray-600 text-sm">{product.ingredients}</p>
            </section>
          )}
          {product.supplement_facts && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Supplement facts</h2>
              <p className="text-gray-600 whitespace-pre-line text-sm">
                {product.supplement_facts}
              </p>
            </section>
          )}
          {product.faqs && product.faqs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">FAQ</h2>
              <ul className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <li key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-900 mb-1">{faq.question}</p>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

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
