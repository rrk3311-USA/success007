import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart</h1>
      <p className="text-gray-600 mb-6">
        Cart powered by Medusa – connect your backend to see items.
      </p>
      <Link
        href="/"
        className="text-[#2854a6] font-medium hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
