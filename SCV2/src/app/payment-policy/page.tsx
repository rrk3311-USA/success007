import Link from "next/link";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Payment Policy | Success Chemistry",
  description: "How payments are processed and protected.",
};

export default function PaymentPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href={ROUTES.home} className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Policy</h1>
      <p className="text-gray-600 mb-10">
        This policy explains how payments are processed and protected.
      </p>
      <BodyProse>
        <h2>Accepted Payment Methods</h2>
        <ul>
          <li>Major credit/debit cards are accepted at checkout.</li>
          <li>Available payment options may vary by location.</li>
        </ul>

        <h2>Secure Checkout</h2>
        <ul>
          <li>We use encryption and secure processors to protect your payment details.</li>
          <li>Payment data is handled by trusted third-party processors and is not stored on our servers.</li>
        </ul>

        <h2>Billing Issues</h2>
        <ul>
          <li>If a payment fails, please confirm your billing details and try again.</li>
          <li>For charges you don&apos;t recognize, contact support immediately.</li>
        </ul>

        <h2>Taxes</h2>
        <ul>
          <li>Sales tax is applied where required by law and calculated at checkout.</li>
        </ul>
      </BodyProse>
    </div>
  );
}
