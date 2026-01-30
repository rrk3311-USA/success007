import Link from "next/link";
import { cn } from "@/lib/utils";
import { BodyProse } from "@/components/BodyProse";
import { ROUTES, SC } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-white/25 backdrop-blur-[30px] saturate-[180%] border border-white/40 p-8 md:p-16 shadow-xl">
        <div className="relative z-10">
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide border"
            style={{
              backgroundColor: `${SC.blueLight}`,
              color: SC.blue,
              borderColor: `${SC.blue}33`,
            }}
          >
            Success Chemistry V2
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-gray-900 bg-gradient-to-r from-gray-700 to-blue-500 bg-clip-text text-transparent">
            Premium Supplements
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl">
            Nature&apos;s nutrients, scientifically formulated. Shop quality
            supplements for health, wellness, and vitality. Powered by Medusa.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={ROUTES.store}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3.5 rounded-full font-medium text-white",
                "bg-gradient-to-r from-blue-500 to-indigo-500",
                "shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
              )}
            >
              Shop Now
            </Link>
            <Link
              href={ROUTES.admin}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3.5 rounded-full font-medium",
                "bg-white/25 backdrop-blur border border-white/40 text-gray-800",
                "hover:bg-white/35 transition-all"
              )}
            >
              Admin
            </Link>
            <Link
              href={ROUTES.preview}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3.5 rounded-full font-medium text-gray-700",
                "border border-gray-300 bg-white/80 hover:bg-white transition-all"
              )}
            >
              Compare icons & styles
            </Link>
            <Link
              href={ROUTES.blog}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3.5 rounded-full font-medium text-gray-700",
                "border border-gray-300 bg-white/80 hover:bg-white transition-all"
              )}
            >
              Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Body / blog sample */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Body & blog sample
        </h2>
        <BodyProse>
          <h1>Short sample</h1>
          <p>
            This is how body and blog content looks with the Medusa font (Inter)
            and clean prose. Use the same style for articles and product copy.
          </p>
          <ul>
            <li>Clear headings and paragraphs</li>
            <li>Lists and blockquotes</li>
            <li>Consistent spacing</li>
          </ul>
          <blockquote>
            &ldquo;One place for all article styling.&rdquo;
          </blockquote>
          <p>
            More samples: <Link href={ROUTES.blog} className="text-sc-blue font-medium hover:underline">Blog</Link> (Why Quality, Ingredients We Use).
          </p>
        </BodyProse>
      </section>
    </div>
  );
}
