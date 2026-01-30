/**
 * Product image paths by size. Use card-hero (750px) for cards, bundles, upsell, recently viewed.
 * Use large only for desktop/tablet product page main image. Use mobile (~400px) for mobile PDP and thumbnails.
 */

export type ProductImageSize = "large" | "card-hero" | "mobile";

const PRODUCTS_SEGMENT = "/images/products/";
const CARD_HERO_SEGMENT = "/images/products-card-hero/";
const MOBILE_SEGMENT = "/images/products-mobile/";

/**
 * Returns the path for a product image in the given size.
 * - large: current full-size (desktop PDP only)
 * - card-hero: 750px for cards, bundles, upsell, recently viewed
 * - mobile: ~400px for mobile PDP and thumbnails
 */
export function getProductImagePath(
  imagePath: string,
  size: ProductImageSize
): string {
  if (size === "large") return imagePath;
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  if (!normalized.includes(PRODUCTS_SEGMENT)) return imagePath;
  if (size === "card-hero") {
    return normalized.replace(PRODUCTS_SEGMENT, CARD_HERO_SEGMENT);
  }
  return normalized.replace(PRODUCTS_SEGMENT, MOBILE_SEGMENT);
}
