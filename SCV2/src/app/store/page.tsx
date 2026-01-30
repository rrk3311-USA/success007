import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SAMPLE_PRODUCTS } from "@/data/sample-products";
import { ROUTES } from "@/lib/constants";

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop</h1>
      <p className="text-gray-600 mb-8 max-w-xl">
        Store powered by Medusa – products will load from backend when connected.
        Below: current product card style with sample products.
      </p>
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
      <Link
        href={ROUTES.home}
        className="inline-block mt-10 text-sc-blue font-medium hover:underline text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
