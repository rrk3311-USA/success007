import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const BLOG_POSTS = [
  {
    slug: "why-quality",
    href: ROUTES.blogSample,
    title: "Why Quality Supplements Matter",
    excerpt:
      "Premium dietary supplements are designed to support your health with nature's nutrients, scientifically formulated.",
  },
  {
    slug: "ingredients-we-use",
    href: ROUTES.blogIngredients,
    title: "Ingredients We Use",
    excerpt:
      "Clean ingredients, third-party testing, and formulas that work with your body. What we look for in every product.",
  },
] as const;

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href={ROUTES.home}
        className="inline-block mb-8 text-sc-blue font-medium hover:underline text-sm"
      >
        ← Back to home
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-600 mb-10">
        Articles and updates. Body content uses the same prose style across all posts.
      </p>
      <ul className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.href}
              className="block p-4 rounded-xl border-2 border-[#2854a6]/15 bg-white hover:border-[#2854a6]/30 hover:shadow-md transition-all"
            >
              <h2 className="font-semibold text-gray-900 mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
