import Link from "next/link";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service | Success Chemistry",
  description: "Terms of Service governing your access to Success Chemistry's website, products, and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href={ROUTES.home} className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Terms of Service</h1>
      <p className="text-gray-600 mb-10">
        These Terms of Service govern your access to Success Chemistry&apos;s website, products, and services.
      </p>
      <BodyProse>
        <h2>Use of the Website</h2>
        <ul>
          <li>You agree to use the site for lawful purposes and not to interfere with the site&apos;s security or availability.</li>
          <li>Content is provided for general wellness information and is not medical advice.</li>
        </ul>

        <h2>Orders & Payments</h2>
        <ul>
          <li>Prices and availability may change without notice.</li>
          <li>We may cancel or limit orders at our discretion, including suspected fraud or misuse.</li>
        </ul>

        <h2>Health Information</h2>
        <ul>
          <li>Supplements are not intended to diagnose, treat, cure, or prevent any disease.</li>
          <li>Always consult your healthcare professional before starting a new supplement regimen.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <ul>
          <li>All site content, logos, and product materials are owned by Success Chemistry or its licensors.</li>
          <li>You may not reproduce, distribute, or exploit content without written permission.</li>
        </ul>

        <h2>Limitation of Liability</h2>
        <ul>
          <li>We are not liable for indirect or incidental damages related to your use of the site or products.</li>
          <li>Our total liability is limited to the amount paid for the product in question.</li>
        </ul>

        <h2>Changes to These Terms</h2>
        <ul>
          <li>We may update these Terms periodically. Continued use means you accept the updated Terms.</li>
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>Questions about these Terms can be sent to support@successchemistry.com.</li>
        </ul>
      </BodyProse>
    </div>
  );
}
