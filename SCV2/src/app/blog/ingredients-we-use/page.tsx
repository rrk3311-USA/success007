import Link from "next/link";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES } from "@/lib/constants";

export default function IngredientsBlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href={ROUTES.blog}
        className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm"
      >
        ← Back to blog
      </Link>
      <BodyProse className="mb-12">
        <h1>Ingredients We Use</h1>
        <p>
          At Success Chemistry we focus on clean ingredients, third-party testing,
          and formulas that work with your body. Here&apos;s what we look for in
          every product we sell.
        </p>
        <h2>Our Standards</h2>
        <ul>
          <li>Clinically studied ingredients where possible</li>
          <li>No artificial colors, flavors, or unnecessary fillers</li>
          <li>Made in the USA in GMP-compliant facilities</li>
          <li>Transparent labeling and third-party testing</li>
        </ul>
        <blockquote>
          &ldquo;We believe in supplements that you can trust—backed by quality
          standards and clear labeling.&rdquo;
        </blockquote>
        <h2>Why It Matters</h2>
        <p>
          Whether you&apos;re looking for support for energy, wellness, or
          specific health goals, our range is built to fit into your routine
          without compromise. Shop with confidence and feel the difference.
        </p>
      </BodyProse>
      <div className="flex flex-wrap gap-4">
        <Link
          href={ROUTES.blog}
          className="inline-block text-sc-blue font-medium hover:underline text-sm"
        >
          ← All posts
        </Link>
        <Link
          href={ROUTES.store}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
