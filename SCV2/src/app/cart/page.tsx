import Link from "next/link";
import PayPalButtons from "@/components/PayPalButtons";

export default function CartPage() {
  // TODO: get cart total from Medusa when connected
  const cartTotal = 0;

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart</h1>
      <p className="text-gray-600 mb-6">
        Cart powered by Medusa – connect your backend to see items.
      </p>

      {cartTotal > 0 ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">
            Total: <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </p>
          <PayPalButtons
            amount={cartTotal}
            description="Success Chemistry"
            onSuccess={() => {
              // TODO: clear cart, redirect to thank-you
            }}
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">Demo checkout (no cart total yet)</p>
          <PayPalButtons
            amount={29.99}
            description="Success Chemistry – demo"
            onSuccess={(details) => console.log("Payment success", details)}
          />
          <p className="mt-3 text-xs text-gray-500">
            Connect Medusa cart to use real total.
          </p>
        </div>
      )}

      <Link
        href="/"
        className="mt-8 inline-block text-[#2854a6] font-medium hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
