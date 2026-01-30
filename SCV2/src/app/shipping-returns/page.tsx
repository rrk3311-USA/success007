import Link from "next/link";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Shipping & Returns | Success Chemistry",
  description: "Processing, shipping, order tracking, returns, and refunds policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href={ROUTES.home} className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Shipping & Returns</h1>
      <p className="text-gray-600 mb-10">
        We aim to ship quickly and make returns simple. Below is our standard policy.
      </p>
      <BodyProse>
        <h2>Processing & Shipping</h2>
        <ul>
          <li>Orders typically process within 1–2 business days.</li>
          <li>Shipping times vary by location and method selected at checkout.</li>
        </ul>

        <h2>Order Tracking</h2>
        <ul>
          <li>A tracking link will be emailed once your order ships.</li>
          <li>If tracking hasn&apos;t updated for 72 hours, contact support for help.</li>
        </ul>

        <h2>Returns</h2>
        <ul>
          <li>We accept returns within 30 days of delivery for unopened items.</li>
          <li>To start a return, email support@successchemistry.com with your order number.</li>
        </ul>

        <h2>Exchanges & Replacements</h2>
        <ul>
          <li>If your order arrives damaged or incorrect, we&apos;ll replace it at no cost.</li>
          <li>Please send photos of the issue so we can resolve it quickly.</li>
        </ul>

        <h2>Refunds</h2>
        <ul>
          <li>Approved refunds are issued to the original payment method.</li>
          <li>Refunds may take 5–10 business days to post depending on your bank.</li>
        </ul>
      </BodyProse>
    </div>
  );
}
