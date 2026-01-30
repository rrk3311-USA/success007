/**
 * Sample products for store/preview until Medusa backend is connected.
 */

export type SampleProduct = {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
};

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    slug: "womens-balance",
    name: "Women's Balance – Female Libido & Arousal Support – 60 Capsules",
    price: 28,
    category: "Women's Health",
    image: "https://successchemistry.com/images/products/52274-401/01.png",
    description:
      "Premium support for women's wellness. Formulated with quality ingredients, 60 capsules per bottle. Made in the USA in a GMP-compliant facility.",
  },
  {
    slug: "prostate-renew-2pack",
    name: "Prostate Renew – 2 pack – Saw Palmetto & Quercetin – 60 Veggie Capsules",
    price: 37.99,
    category: "Bundle Deals",
    image: "https://successchemistry.com/images/products/14179-504-2/01.png",
    description:
      "Two bottles of Prostate Renew with Saw Palmetto and Quercetin. 60 veggie capsules per bottle. Bundle and save.",
  },
  {
    slug: "lutein-2pack",
    name: "Lutein Supplement for Eye Health – 2 Pack – 120 Capsules Total",
    price: 37.99,
    category: "Best Sellers",
    image: "https://successchemistry.com/images/products/10786-807-2/01.png",
    description:
      "Support eye health with lutein. Two bottles, 120 capsules total. Best seller.",
  },
];

export function getProductBySlug(slug: string): SampleProduct | undefined {
  return SAMPLE_PRODUCTS.find((p) => p.slug === slug);
}
