import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { StoreProductsList } from "./StoreProductsList";

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop</h1>
      <p className="text-gray-600 mb-8 max-w-xl">
        Products from Medusa. Seed with data from{" "}
        <code className="text-sm bg-gray-100 px-1 rounded">/data/success-3-products.json</code>{" "}
        and images from success project.
      </p>
      <StoreProductsList />
      <Link
        href={ROUTES.home}
        className="inline-block mt-10 text-[#2854a6] font-medium hover:underline text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
