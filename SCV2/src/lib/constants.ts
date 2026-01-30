/**
 * Shared constants – one place for colors and copy.
 */

export const SC = {
  blue: "#2854a6",
  blueDark: "#1e3a8a",
  blueLight: "rgba(40, 84, 166, 0.1)",
} as const;

export const ROUTES = {
  home: "/",
  store: "/store",
  cart: "/cart",
  admin: "/admin",
  preview: "/preview",
  blog: "/blog",
  blogSample: "/blog-sample",
  blogIngredients: "/blog/ingredients-we-use",
  product: (slug: string) => `/product/${slug}`,
} as const;
