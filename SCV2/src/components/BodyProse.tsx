"use client";

import { cn } from "@/lib/utils";

/**
 * Body/blog prose – headings, paragraphs, lists, blockquote.
 * Use for article and blog content. Style children with .body-prose wrapper.
 */
export function BodyProse({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "body-prose max-w-[65ch] mx-auto text-gray-600 leading-relaxed",
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:first:mt-0",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_p]:mb-4 [&_p]:leading-relaxed",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-[#2854a6] [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-[#2854a6]/5 [&_blockquote]:rounded-r [&_blockquote]:italic",
        className
      )}
    >
      {children}
    </article>
  );
}
