"use client";

import Link from "next/link";
import Image from "next/image";
import { SC } from "@/lib/constants";
import { getProductImagePath } from "@/lib/image-paths";
import { cn } from "@/lib/utils";

export type ProductCardProps = {
  slug?: string;
  name: string;
  price: number;
  category: string;
  image: string;
  className?: string;
};

/**
 * Current/live product card style – SC blue accent, gradient CTA.
 * Keep this as the single source for product cards.
 */
export function ProductCard({
  slug,
  name,
  price,
  category,
  image,
  className,
}: ProductCardProps) {
  const href = slug ? `/product/${slug}` : "#";
  const content = (
    <>
      <div className="aspect-square bg-gradient-to-br from-sky-50 to-white relative overflow-hidden rounded-t-xl">
        <Image
          src={getProductImagePath(image, "card-hero")}
          alt={name}
          width={400}
          height={400}
          className="w-full h-full object-contain p-4"
          unoptimized
        />
      </div>
      <div className="p-4 bg-white">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: SC.blue }}
        >
          {category}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{name}</h3>
        <p className="text-xl font-bold" style={{ color: SC.blue }}>
          ${price.toFixed(2)}
        </p>
        <span
          className={cn(
            "mt-3 inline-flex w-full justify-center rounded-full py-2.5 font-medium text-white",
            "bg-gradient-to-r from-blue-500 to-indigo-500",
            "shadow-md hover:shadow-lg transition-shadow"
          )}
        >
          Add to cart
        </span>
      </div>
    </>
  );

  if (href !== "#") {
    return (
      <Link
        href={href}
        className={cn(
          "block rounded-xl overflow-hidden border-2 bg-white",
          "border-[#2854a6]/20 shadow-md hover:shadow-lg hover:border-[#2854a6]/30 transition-all",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border-2 bg-white border-[#2854a6]/20 shadow-md",
        className
      )}
    >
      {content}
    </div>
  );
}
