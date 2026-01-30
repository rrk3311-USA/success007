import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Success Chemistry",
  description: "Get in touch with Success Chemistry. Questions about our supplements, orders, or customer support.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href={ROUTES.home} className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact</h1>
      <p className="text-gray-600 mb-10">
        We&apos;re here to assist you with any questions or concerns about our dietary supplement products and services.
      </p>

      <div className="grid gap-6 sm:grid-cols-1 mb-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Address</p>
          <p className="text-gray-900">
            8400 West Sunset Road<br />
            Las Vegas NV, 89113
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Email</p>
          <a href="mailto:info@successchemistry.com" className="text-sc-blue font-medium hover:underline">
            info@successchemistry.com
          </a>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Phone</p>
          <a href="tel:+19296427553" className="text-sc-blue font-medium hover:underline">
            (929) 6427553
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Send a message</h2>
        <ContactForm />
      </div>
    </div>
  );
}
