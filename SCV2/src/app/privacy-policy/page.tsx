import Link from "next/link";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | Success Chemistry",
  description: "How we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href={ROUTES.home} className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
      <p className="text-gray-600 mb-10">
        We respect your privacy and are committed to protecting your personal data.
      </p>
      <BodyProse>
        <h2>Information We Collect</h2>
        <ul>
          <li>Contact details such as name, email, and shipping address when you place an order.</li>
          <li>Site usage data like device type and pages visited for analytics and improvements.</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>To process orders, provide support, and improve our products and experience.</li>
          <li>To send order updates and, if opted in, marketing emails.</li>
        </ul>

        <h2>Sharing</h2>
        <ul>
          <li>We only share data with trusted service providers necessary for operations.</li>
          <li>We do not sell personal information.</li>
        </ul>

        <h2>Your Choices</h2>
        <ul>
          <li>You can opt out of marketing emails at any time.</li>
          <li>You may request access or deletion of your data by contacting support.</li>
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>Questions? Email support@successchemistry.com.</li>
        </ul>
      </BodyProse>
    </div>
  );
}
