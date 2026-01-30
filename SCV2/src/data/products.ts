/**
 * Top 12 + Sclera – text harvested from success project (deploy-site/products-data.js).
 * Images: relative URLs for local build only (served from /images/products/ in this app).
 * No external domain; V2 is self-contained for local preview.
 */

const IMAGE_BASE = "";

function imageUrls(paths: string[]): string[] {
  return paths.map((p) => (IMAGE_BASE ? `${IMAGE_BASE}${p}` : p.startsWith("/") ? p : `/${p}`));
}

export type ProductFaq = { question: string; answer: string };

export type Product = {
  slug: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  short_description?: string;
  description?: string;
  suggested_use?: string;
  supplement_facts?: string;
  ingredients?: string;
  images: string[];
  image: string;
  /** From JSON: upc, gtin, weight, dimensions, key_search_terms, faqs */
  upc?: string;
  gtin?: string;
  weight?: string;
  dimensions?: string;
  key_search_terms?: string;
  faqs?: ProductFaq[];
};

export const TOP_PRODUCTS: Product[] = [
  {
    slug: "52274-401",
    sku: "52274-401",
    name: "Success Chemistry Women's Balance – Female Libido & Arousal Support Supplement with L-Arginine, Maca, Ashwagandha, Ginseng & Zinc – 60 Capsules",
    price: 28,
    category: "Women's Health",
    short_description:
      "Premium female libido enhancement supplement with clinically-studied ingredients including L-Arginine, Maca Root, Ashwagandha, and Korean Ginseng. Supports natural arousal, energy levels, and hormonal balance for women.",
    description:
      "Rediscover Balance, Confidence & Connection. Women's Balance by Success Chemistry is thoughtfully crafted to support feminine wellness from the inside out. Modern life, stress, and hormonal changes can affect energy, mood, and responsiveness. This formula is designed to help support the body's natural balance so you can feel more in tune with yourself. Advanced Botanical & Nutrient Support: This unique blend combines time-honored botanicals with modern nutritional science. Ingredients such as Maca root, Ashwagandha, Ginseng, and Damiana have been traditionally used to support vitality and female wellness. L-Arginine supports healthy blood flow, while essential vitamins and minerals help support energy metabolism and overall health. Designed for Daily Use: Women's Balance is intended for consistent daily use as part of a healthy lifestyle. With 30 servings per bottle, it fits seamlessly into your routine to support long-term wellness goals. Clean, Thoughtful Formulation: Vegetarian capsules, Non-GMO ingredients, Manufactured in the USA, Quality tested for purity and potency. Feel supported, balanced, and confident — naturally. *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
    suggested_use:
      "As a dietary supplement take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Vitamin A (as Beta-Carotene) - 2500 IU, Thiamin (Vitamin B1) - 2mg, Niacin (Vitamin B3) - 20mg, Vitamin B6 - 5mg, Vitamin B12 - 25mcg, Pantothenic Acid (Vitamin B5) - 10mg, Zinc - 15mg, L-Arginine - 500mg, BioPerine® Black Pepper Extract - 5mg, Proprietary Botanical Blend - 600mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    upc: "783325397399",
    gtin: "783325397399",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    ingredients:
      "Vitamin A (as Beta-Carotene), Thiamin, Niacin, Vitamin B6, Vitamin B12, Pantothenic Acid, Zinc, L-Arginine, BioPerine® Black Pepper Extract, Proprietary Botanical Blend. Other: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    key_search_terms:
      "women's libido enhancement, female arousal supplement, natural intimacy support, sexual health vitamins, hormonal balance for women",
    images: imageUrls([
      "/images/products/52274-401/01.png",
      "/images/products/52274-401/02.png",
      "/images/products/52274-401/03.png",
      "/images/products/52274-401/04.png",
      "/images/products/52274-401/05.png",
      "/images/products/52274-401/06.png",
      "/images/products/52274-401/07.png",
      "/images/products/52274-401/08.png",
      "/images/products/52274-401/09.png",
      "/images/products/52274-401/10.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/52274-401/01.png`,
  },
  {
    slug: "14179-504-2",
    sku: "14179-504-2",
    name: "Success Chemistry® Prostate Renew - 2 pack! - Natural Prostate Supplement for Men with Saw Palmetto & Quercetin - 60 Veggie Capsules",
    price: 37.99,
    category: "Bundle Deals",
    short_description:
      "Advanced prostate health formula with Saw Palmetto, Quercetin, and essential nutrients. Clinically-proven ingredients support healthy urinary flow, reduce frequent nighttime trips, and promote optimal prostate function for men over 40.",
    description:
      "Discover Success Chemistry® Prostate Renew – a premium prostate support supplement for men designed to promote healthy prostate function, improve urinary flow, reduce frequent nighttime bathroom trips, and support overall men's urinary health naturally. This advanced natural prostate health formula features a powerful blend of traditional herbs like saw palmetto, quercetin, juniper, uva ursi, pumpkin seed oil, and burdock root for gentle, effective daily support. Key Features: Improves Urinary Flow & Reduces Nighttime Trips; Supports Healthy Prostate Function; Promotes Healthy Inflammation Response; Natural Urinary Tract Support; 60 easy-to-swallow veggie capsules per bottle (full 30-day supply) – just 2 capsules daily with a meal. Made in a GMP-certified facility.",
    suggested_use:
      "As a dietary supplement take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Saw Palmetto Extract - 320mg, Quercetin - 250mg, Pumpkin Seed Oil - 200mg, Juniper Berry Extract - 150mg, Uva Ursi Extract - 100mg, Burdock Root - 100mg, Beta-Sitosterol - 50mg, Zinc - 15mg, Vitamin D3 - 1000 IU, Vitamin B6 - 10mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325397405",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    ingredients:
      "Saw Palmetto Extract, Quercetin, Pumpkin Seed Oil, Juniper Berry Extract, Uva Ursi Extract, Burdock Root, Beta-Sitosterol, Zinc, Vitamin D3, Vitamin B6, Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    key_search_terms:
      "prostate health supplement, saw palmetto for men, urinary flow support, natural prostate relief, men's wellness vitamins",
    images: imageUrls([
      "/images/products/14179-504-2/01.png",
      "/images/products/14179-504-2/02.jpg",
      "/images/products/14179-504-2/03.jpg",
      "/images/products/14179-504-2/04.jpg",
      "/images/products/14179-504-2/05.jpg",
      "/images/products/14179-504-2/06.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/14179-504-2/01.png`,
  },
  {
    slug: "10786-807-2",
    sku: "10786-807-2",
    name: "Lutein Supplement for Eye Health Vision Support with Zeaxanthin 2 Pack 120 Capsules Total",
    price: 37.99,
    category: "Best Sellers",
    short_description:
      "Premium eye health formula with 20mg Lutein and Zeaxanthin. Protects against blue light damage, supports macular health, and promotes clear vision. Essential nutrients for digital age eye protection.",
    description:
      "This 2-pack of Lutein and Zeaxanthin supplements provides a 4-month supply with 120 capsules total, designed to support your long-term eye health and vision. Each serving is packed with natural antioxidants that help protect against blue light and promote macular health. This formula works to reduce eye strain and fatigue from screen time and digital devices, while nourishing your eyes for improved clarity and visual comfort. Made in the USA in a GMP-certified facility, these gluten-free and non-GMO capsules offer a clean way to support vibrant vision.",
    suggested_use:
      "As a dietary supplement, take one (1) capsule once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Capsule. Servings Per Container: 120. Lutein (from Lutein 5%) - 20mg, Zeaxanthin (from Zeaxanthin 5%) - 2mg, Vitamin C - 100mg, Vitamin E - 30 IU, Zinc - 15mg, Copper - 1mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325396675",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    ingredients:
      "Lutein, Zeaxanthin, Vitamin C, Vitamin E, Zinc, Copper, Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    key_search_terms:
      "eye health supplements, lutein and zeaxanthin vitamins, blue light protection supplements, macular degeneration support, vision health for digital age",
    images: imageUrls([
      "/images/products/10786-807-2/01.png",
      "/images/products/10786-807-2/02.png",
      "/images/products/10786-807-2/03.jpg",
      "/images/products/10786-807-2/04.jpg",
      "/images/products/10786-807-2/05.png",
      "/images/products/10786-807-2/06.jpg",
      "/images/products/10786-807-2/07.jpeg",
      "/images/products/10786-807-2/08.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/10786-807-2/01.png`,
  },
  {
    slug: "B072MMW71X-1",
    sku: "B072MMW71X-1",
    name: "Hair La Fluer Maximum, Hair Growth, Island formulation with Horsetail, Bamboo and Peony extract",
    price: 32.99,
    category: "Legacy",
    short_description:
      "Maximum strength hair growth formula with island-sourced botanicals. Horsetail and Bamboo provide natural silica for stronger hair, while Peony extract supports scalp health and promotes thicker, fuller hair growth.",
    description:
      "High potency proprietary blend supplement with 20+ fast absorbing ingredients – Enhanced 5000 mcg Biotin, Horsetail Extract, Saw Palmetto, Bamboo Extract, Collagen and other natural ingredients to promote natural growth of existing hair. Thicker hair that regrows at max speed. DHT blocker – natural DHT blocking properties for prevention of hair pattern baldness for adults. Made in the USA, GMP compliant facility. 60-day, 100% money-back guarantee.",
    suggested_use:
      "As a dietary supplement, take two (2) capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Biotin - 5000mcg, Horsetail Extract - 300mg, Bamboo Extract - 200mg, Saw Palmetto - 200mg, Collagen - 100mg, Peony Extract - 50mg, Vitamin C - 60mg, Vitamin E - 30 IU, Zinc - 15mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "651536055516",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "hair growth supplements, biotin for hair growth, natural hair vitamins, DHT blocker for hair loss, thicker hair supplements",
    images: imageUrls([
      "/images/products/B072MMW71X-1/01.png",
      "/images/products/B072MMW71X-1/02.jpg",
      "/images/products/B072MMW71X-1/03.jpg",
      "/images/products/B072MMW71X-1/04.jpg",
      "/images/products/B072MMW71X-1/05.jpg",
      "/images/products/B072MMW71X-1/06.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/B072MMW71X-1/01.png`,
  },
  {
    slug: "31412-404U-3",
    sku: "31412-404U-3",
    name: "Success Chemistry UTI Relief 3-Pack - 60 Capsules Each - Natural D-Mannose & Cranberry Formula for Urinary Health Support - Vegan Cellulose Capsules - 3-Month Supply",
    price: 49.99,
    category: "Unisex",
    short_description:
      "Powerful urinary tract support with clinically-studied D-Mannose and concentrated Cranberry extract. Prevents UTI recurrence, supports bladder health, and promotes urinary tract wellness. Vegan cellulose capsules, 3-month supply.",
    description:
      "Boost Your Urinary Health Naturally – 3 bottle bundle. Discover the Success Chemistry UTI Relief 3-Pack – a trio of 60 capsules each, offering a natural formula for urinary health. This vegan cellulose capsule pack provides a month's supply per bottle, supporting your daily vitality. Key Ingredients: 1000 mg D-Mannose, 150 mg Cranberry Juice Powder, 100 mg Hibiscus Flower Extract, 100 mg Dandelion Herb Extract. These ingredients help maintain urinary tract health. Made without artificial additives.",
    suggested_use:
      "As a dietary supplement, take one (1) capsule once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Capsule. Servings Per Container: 60. D-Mannose - 1000mg, Cranberry Juice Powder - 150mg, Hibiscus Flower Extract - 100mg, Dandelion Herb Extract - 100mg, Vitamin C - 60mg, Probiotic Blend - 50mg. Other Ingredients: Cellulose (Vegan Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325396668",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "UTI relief supplements, D-mannose cranberry pills, urinary tract health support, bladder health vitamins, natural UTI prevention",
    images: imageUrls([
      "/images/products/31412-404U-3/01.png",
      "/images/products/31412-404U-3/02.png",
      "/images/products/31412-404U-3/03.jpg",
      "/images/products/31412-404U-3/04.jpg",
      "/images/products/31412-404U-3/05.jpg",
      "/images/products/31412-404U-3/06.png",
      "/images/products/31412-404U-3/07.jpg",
      "/images/products/31412-404U-3/08.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/31412-404U-3/01.png`,
  },
  {
    slug: "1960-102",
    sku: "1960-102",
    name: "Skinny Bean African Mango Extract Drops - Ketogenic, Beauty Support, 2 fl oz",
    price: 25,
    category: "Weight Loss",
    short_description:
      "Concentrated African Mango extract in convenient liquid drops. Supports ketogenic diet, boosts metabolism, reduces appetite, and enhances energy levels. Fast-absorbing liquid formula for maximum effectiveness.",
    description:
      "Unlock the power of African mango with Skinny Bean Keto Drops, a natural supplement designed to support your ketogenic lifestyle. These concentrated drops are formulated to boost metabolism, control appetite, balance blood sugar, and enhance the body's ability to convert fat into energy. Unlike many energy-boosting supplements, Skinny Bean Keto Drops maintain proper hydration levels and support overall health, making it an ideal choice for those seeking a holistic approach to weight management and overall well-being.",
    suggested_use:
      "As a dietary supplement, take one (1) dropperful (1ml) twice daily before meals or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Dropperful (1ml). Servings Per Container: 60. African Mango Extract - 200mg, Green Tea Extract - 100mg, Raspberry Ketones - 50mg, Apple Cider Vinegar - 50mg, Vitamin B12 - 500mcg, Chromium - 200mcg. Other Ingredients: Vegetable Glycerin, Purified Water, Natural Flavors.",
    gtin: "651536055646",
    weight: "2oz",
    dimensions: "1.5 inches wide x 4 inches tall",
    key_search_terms:
      "African mango extract, keto diet drops, weight loss supplements, metabolism booster, appetite suppressant, ketogenic diet support",
    images: imageUrls([
      "/images/products/1960-102/01.jpg",
      "/images/products/1960-102/02.jpg",
      "/images/products/1960-102/03.jpg",
      "/images/products/1960-102/04.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/1960-102/01.jpg`,
  },
  {
    slug: "10777-810",
    sku: "10777-810",
    name: "Liver Cleanse Pills with Detox Support Formula by Success Chemistry – Supports liver health with Milk Thistle, Dandelion Root, and Artichoke Extract. Contains 60 capsules.",
    price: 25.97,
    category: "Best Sellers",
    short_description:
      "Comprehensive liver support formula with Milk Thistle (Silymarin), Dandelion Root, and Artichoke Extract. Promotes natural detoxification, supports healthy liver function, and aids digestive health. Vegetarian capsules.",
    description:
      "Support your liver health with Liver Cleanse Pills by Success Chemistry. This formula features natural ingredients like milk thistle, dandelion root, and artichoke extract, traditionally known for their liver-supporting properties. It assists with the body's natural detox process and helps maintain overall liver function. Key Benefits: Supports Liver Health; Assists Detoxification; Liver Function Support (artichoke extract and turmeric); Supports Inflammation Response (turmeric and ginger); Comprehensive Formula. Ingredients: Milk Thistle, Dandelion Root, Artichoke Extract, Alfalfa & Burdock Root, Celery Powder & Feverfew, Grape Seed Extract & Raspberry Powder, Turmeric & Ginger, Berberine HCl & Yellow Dock. 60 easy-to-swallow capsules per bottle, one-month supply.",
    suggested_use:
      "As a dietary supplement take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Milk Thistle Extract - 300mg, Dandelion Root - 200mg, Artichoke Extract - 150mg, Turmeric Extract - 100mg, Ginger Extract - 50mg, Alfalfa - 50mg, Burdock Root - 50mg, Vitamin C - 60mg, Selenium - 100mcg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325395272",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    ingredients:
      "Milk Thistle, Dandelion Root, Artichoke Extract, Alfalfa, Burdock Root, Celery Powder, Feverfew, Grape Seed Extract, Raspberry Powder, Turmeric, Ginger, Berberine HCl, Yellow Dock. Other: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    key_search_terms:
      "liver cleanse supplements, milk thistle detox pills, liver detox support, dandelion root liver health, artichoke extract liver, natural liver support",
    faqs: [
      { question: "How does Milk Thistle support liver health and detoxification?", answer: "Milk Thistle contains silymarin, a powerful antioxidant that helps protect liver cells from toxins and supports the liver's natural regeneration process. It has been used for centuries to promote liver health and is one of the most researched herbs for liver support." },
      { question: "How long should I take Liver Cleanse for a complete detox?", answer: "For a thorough liver cleanse, we recommend taking Liver Cleanse Pills for 30-60 days. Many users continue taking it as ongoing liver support, especially if exposed to alcohol, processed foods, or environmental toxins regularly." },
      { question: "What are the signs that I might need liver support?", answer: "Common signs include fatigue, digestive issues, skin problems, difficulty losing weight, and feeling sluggish after meals. If you consume alcohol, take medications, or eat processed foods regularly, your liver may benefit from additional support." },
      { question: "Can I take Liver Cleanse while drinking alcohol occasionally?", answer: "Yes, Liver Cleanse can help support your liver when consuming alcohol occasionally. The Milk Thistle and other ingredients help protect liver cells from oxidative stress. However, for best results, minimize alcohol consumption during your cleanse." },
      { question: "What makes this liver cleanse formula comprehensive?", answer: "Our formula combines 10+ liver-supporting ingredients: Milk Thistle (silymarin), Dandelion Root (bile flow), Artichoke Extract (digestion), Turmeric (inflammation), Ginger, Burdock Root, and antioxidants like Grape Seed Extract - providing multi-faceted liver support." },
      { question: "Is Liver Cleanse safe for daily long-term use?", answer: "Yes, Liver Cleanse is made with natural ingredients that are safe for ongoing daily use. Many healthcare practitioners recommend continuous liver support, especially in today's world of processed foods and environmental toxins." },
      { question: "How should I take Liver Cleanse Pills for best results?", answer: "Take 2 veggie capsules once daily after a meal with an 8oz glass of water. Taking with food helps absorption and reduces any potential stomach sensitivity. For enhanced detox, drink plenty of water throughout the day." },
      { question: "Can Liver Cleanse help with weight loss?", answer: "A healthy liver is essential for proper fat metabolism. By supporting liver function and detoxification, Liver Cleanse may help optimize your body's ability to process fats and toxins, which can support weight management efforts." },
      { question: "Are there any side effects from Liver Cleanse?", answer: "Liver Cleanse is made with natural, well-tolerated ingredients. Some people may experience mild digestive changes as the body detoxifies. If you're pregnant, nursing, or taking medications, consult your healthcare provider before use." },
      { question: "Is this liver supplement vegetarian-friendly?", answer: "Yes, Liver Cleanse Pills use vegetable capsules (Hypromellose) and contain no animal-derived ingredients, making them suitable for vegetarians seeking liver support." },
    ],
    images: imageUrls([
      "/images/products/10777-810/01.png",
      "/images/products/10777-810/02.png",
      "/images/products/10777-810/03.png",
      "/images/products/10777-810/04.png",
      "/images/products/10777-810/05.png",
      "/images/products/10777-810/06.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/10777-810/01.png`,
  },
  {
    slug: "783325395333",
    sku: "783325395333",
    name: "Moringa Oleifera Supplement by Success Chemistry - 800mg Natural Leaf Extract for Energy, Joint Health, and Sleep Quality - 60 Capsules",
    price: 18,
    category: "Legacy",
    short_description:
      "Premium Moringa Oleifera leaf extract standardized to 800mg per serving. Rich in vitamins, minerals, and antioxidants. Supports sustained energy, joint flexibility, sleep quality, and overall wellness. Non-GMO, vegan capsules.",
    description:
      "Unlock the Power of Moringa Oleifera with Success Chemistry. Each capsule features 800mg of pure Moringa leaf extract, a nutrient-dense superfood renowned for its health-boosting properties. Key Benefits: Supports Energy Levels; Promotes Joint Health; Enhances Sleep Quality; Rich in Nutrients (vitamins A, C, E, calcium, potassium); Antioxidant Protection. Pure and Natural, free from artificial additives. 60 easy-to-swallow capsules, one-month supply.",
    suggested_use:
      "As a dietary supplement, take two (2) capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Moringa Oleifera Leaf Extract - 800mg, Vitamin A - 1500 IU, Vitamin C - 60mg, Calcium - 100mg, Iron - 5mg, Potassium - 200mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325395333",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "moringa oleifera supplements, moringa leaf extract, natural energy supplements, joint health vitamins, sleep quality support, superfood supplements",
    images: imageUrls([
      "/images/products/783325395333/01.png",
      "/images/products/783325395333/02.jpg",
      "/images/products/783325395333/03.png",
      "/images/products/783325395333/04.jpg",
      "/images/products/783325395333/05.jpg",
      "/images/products/783325395333/06.jpg",
      "/images/products/783325395333/07.jpg",
      "/images/products/783325395333/08.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/783325395333/01.png`,
  },
  {
    slug: "B01KB6CKV4",
    sku: "B01KB6CKV4",
    name: "Womens Probiotic by Skinny Bean Probiotics best for Slimming",
    price: 34,
    category: "Unisex",
    short_description:
      "Advanced probiotic formula designed specifically for women's weight management. Contains clinically-studied strains that support metabolism, digestive health, and healthy weight loss. Promotes gut balance and overall wellness.",
    description:
      "Experience the Power of Slimming™ Probiotic 40 Billion by Skinny Bean. Designed to enhance your health and beauty. Our advanced probiotic formula ensures you not only feel healthier but also more radiant. Designed for Weight Loss and Health – specifically engineered with strains proven to clean your gut and assist in weight loss. Premium Ingredients: Proprietary Blend of 40 Billion Organisms, MAKTREK Bi-Pass Technology. Key strains include Lactobacillus acidophilus La-14, Bifidobacterium lactis Bl-04, Lactobacillus plantarum Lp-115, Lactobacillus paracasei Lpc-37, Marine Polysaccharide Complex, Fructooligosaccharide. Money-back guarantee.",
    suggested_use:
      "As a dietary supplement, take one (1) capsule once a day before a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Capsule. Servings Per Container: 40. Probiotic Blend - 40 Billion CFU (Lactobacillus acidophilus La-14, Bifidobacterium lactis Bl-04, Lactobacillus plantarum Lp-115, Lactobacillus paracasei Lpc-37), Marine Polysaccharide Complex - 100mg, Fructooligosaccharide - 50mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "women's probiotic for weight loss, slimming probiotics, gut health supplements, digestive health for women, metabolism boosting probiotics",
    images: imageUrls([
      "/images/products/B01KB6CKV4/01.jpg",
      "/images/products/B01KB6CKV4/02.jpg",
      "/images/products/B01KB6CKV4/03.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/B01KB6CKV4/01.jpg`,
  },
  {
    slug: "20647-507-3",
    sku: "20647-507-3",
    name: "3 Bottle - BUNDLE DEAL - NEW LUNG - Lung Cleanse",
    price: 45,
    category: "Lung Health",
    short_description:
      "Comprehensive lung cleanse formula with natural herbs and nutrients. Supports respiratory health, promotes clear breathing, and aids lung detoxification. Ideal for smokers, ex-smokers, or anyone seeking respiratory wellness. 3-month supply.",
    description:
      "Introducing the Premium Lung Detox 3-Pack Bundle. Each bottle is packed with a robust blend of vitamins, minerals, and herbal extracts, all aimed at supporting lung function, boosting your immune system, and enhancing your overall vitality. Key Benefits: Lung Health (Molybdenum and Vitamin C); Immune Support (Vitamin D, Echinacea, Beta Glucan, Spirulina); Antioxidant Power (Lutein, Lycopene, Bilberry, Grape Seed, Pomegranate); Energy & Vitality (B-vitamins, Magnesium); Comprehensive Nutrition. Ingredients Spotlight: Stinging Nettle, Saw Palmetto, Green Tea, Chinese Hawthorn, Cassia Cinnamon, Garlic. 3 bottles – significant savings.",
    suggested_use:
      "As a dietary supplement, take two (2) capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 90. Vitamin C - 500mg, Vitamin D3 - 2000 IU, Molybdenum - 100mcg, Echinacea Extract - 200mg, Beta Glucan - 100mg, Spirulina - 100mg, Lutein - 10mg, Lycopene - 10mg, Bilberry Extract - 50mg, Grape Seed Extract - 50mg. Other Ingredients: Stinging Nettle, Saw Palmetto, Green Tea, Chinese Hawthorn, Cassia Cinnamon, Garlic, Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325396644",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "lung cleanse supplements, lung detox pills, respiratory health support, smoker's lung cleanse, breathing support vitamins, lung health formula",
    images: imageUrls([
      "/images/products/20647-507-3/01.jpg",
      "/images/products/20647-507-3/02.jpg",
      "/images/products/20647-507-3/03.png",
      "/images/products/20647-507-3/04.jpg",
      "/images/products/20647-507-3/05.jpg",
      "/images/products/20647-507-3/06.jpg",
      "/images/products/20647-507-3/07.png",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/20647-507-3/01.jpg`,
  },
  {
    slug: "5531-502",
    sku: "5531-502",
    name: "Perfect Yoni Organic Women's Probiotic - Vaginal Health Supplement | Perfect Yoni - 60 Capsules of Probiotics for Women",
    price: 26.68,
    category: "Legacy",
    short_description:
      "Specialized probiotic formula for women's intimate health. Contains beneficial bacteria strains that support vaginal pH balance, prevent yeast infections, and promote optimal feminine wellness. Organic, vegan-friendly capsules.",
    description:
      "Perfect Yoni Organic Women's Probiotic combines a powerful proprietary blend of natural, organic ingredients designed to promote a balanced vaginal flora, support yeast levels, and maintain healthy pH balance. Free from artificial additives, this supplement is tailored to support optimal vaginal health and overall wellness. The unique blend of herbs, extracts, and nutrients works synergistically to stabilize vaginal health and restore natural balance. Proprietary Blend includes Pumpkin Extract, Sarsaparilla Extract, Muira Puama Extract, Oat Straw Extract, Boron, Cayenne Pepper Extract, Catuaba Extract, Licorice Extract, Tribulus Terrestris, and more.",
    suggested_use:
      "As a dietary supplement, take one (1) capsule once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Capsule. Servings Per Container: 60. Proprietary Blend - 745mg (Pumpkin Extract, Sarsaparilla Extract, Muira Puama Extract, Oat Straw Extract, Boron, Cayenne Pepper Extract, Catuaba Extract, and more). Probiotic Blend - 50mg. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325395579",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "women's vaginal probiotic, feminine pH balance, yeast infection prevention, vaginal health supplements, organic women's probiotic, intimate health support",
    images: imageUrls([
      "/images/products/5531-502/01.png",
      "/images/products/5531-502/02.jpg",
      "/images/products/5531-502/03.jpg",
      "/images/products/5531-502/04.jpg",
      "/images/products/5531-502/05.jpg",
      "/images/products/5531-502/06.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/5531-502/01.png`,
  },
  {
    slug: "1994-807-1",
    sku: "1994-807-1",
    name: "EyesWhite - Eye Whitening Supplement for Bright, Radiant Eyes",
    price: 26.99,
    category: "Unisex",
    short_description:
      "Innovative eye whitening supplement with natural ingredients that reduce eye redness and yellowing. Supports clear, bright white sclera and overall eye health. Contains antioxidants and nutrients for radiant, youthful-looking eyes.",
    description:
      "Illuminate your gaze with EyesWhite, the premier eye whitening supplement designed to enhance the beauty of your eyes. Formulated with a potent blend of natural ingredients, EyesWhite promotes eye brightness, whitening, and detoxification. Lutein supports eye health and shields against oxidative stress. N-Acetyl Cysteine detoxifies and rejuvenates. Bilberry Extract enhances microcirculation. Alpha Lipoic Acid acts as a powerful antioxidant, brightening tired eyes. Formulated with Eyebright and Lutein to support natural eye care, reduce eye strain, and promote clearer, whiter eyes. Perfect for those spending long hours in front of screens.",
    suggested_use:
      "As a dietary supplement, take one (1) capsule twice daily after meals with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 1 Capsule. Servings Per Container: 60. Lutein - 10mg, Zeaxanthin - 2mg, Eyebright Extract - 200mg, N-Acetyl Cysteine - 150mg, Bilberry Extract - 100mg, Alpha Lipoic Acid - 50mg, Vitamin C - 100mg, Vitamin E - 30 IU. Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.",
    gtin: "783325395944",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "eye whitening supplements, bright eyes vitamins, eye redness relief, sclera whitening pills, eye health supplements, clear eyes vitamins, eye detox",
    images: imageUrls([
      "/images/products/1994-807-1/01.png",
      "/images/products/1994-807-1/02.jpg",
      "/images/products/1994-807-1/03.jpg",
      "/images/products/1994-807-1/04.jpg",
      "/images/products/1994-807-1/05.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/1994-807-1/01.png`,
  },
  // Sclera White – imported from success project (sclera product)
  {
    slug: "10786-807",
    sku: "10786-807",
    name: "Sclera White - Eye Beauty Dietary Supplement With Eyebright & Lutein",
    price: 27.36,
    category: "Best Sellers",
    short_description:
      "Transform your eye health with Sclera White – the ultimate dietary supplement designed to enhance your natural beauty. Enriched with Eyebright and Lutein, this powerful formula promotes the health of ocular tissues while helping to whiten your eyes. Experience relief from yellowing with our expertly crafted lutein supplement for eye health.",
    description:
      "Sclera White Dietary Supplement for Eyes With Eyebright & Lutein. Transform your eye health with Sclera White - the ultimate dietary supplement designed to enhance your natural beauty. Enriched with Eyebright and Lutein, this powerful formula promotes the health of ocular tissues while helping to whiten your eyes. Experience relief from yellowing with our expertly crafted lutein supplement for eye health, featuring lutein and bilberry extract to support vibrant vision. Say goodbye to dullness! Sclera White is not just another eye whitening solution; it's your go-to for achieving that bright, captivating gaze. Our unique blend includes lutein and zeaxanthin, which are essential for maintaining eye wellness. Sclera White is made in Utah, USA, using organically sourced extracts in an FDA-compliant facility operating with GMP guidelines.",
    suggested_use:
      "As a dietary supplement take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.",
    supplement_facts:
      "Serving Size: 2 Capsules. Servings Per Container: 30. Vitamin A (as Beta-carotene) 100 mcg RAE 11%, Vitamin C (as Ascorbic acid) 200 mg 222%, Vitamin E (DL-Alpha tocopheryl acetate) 20 mg 133%, Thiamin 8 mg 667%, Riboflavin 8 mg 615%, Niacin 40 mg NE 250%, Vitamin B12 27 mcg 1,125%, Calcium 50 mg 4%, Biotin 800 mcg 2,667%, Magnesium 40 mg 10%, Zinc 32 mg 291%, Selenium 8 mcg 15%, Copper 2 mg 222%, Chromium 3.6 mcg. Proprietary Blend 481 mg (Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, Lycopene). Other Ingredients: Rice Flour, Hypromellose (vegetable capsule), Vegetable Stearate, Silicon Dioxide.",
    ingredients:
      "Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, Lycopene. Vitamins A, C, E, B-complex. Other: Rice Flour, Hypromellose (vegetable capsule), Vegetable Stearate, Silicon Dioxide.",
    gtin: "651074168402",
    weight: "3oz",
    dimensions: "2 inches wide x 3.5 inches tall",
    key_search_terms:
      "sclera white supplements, eye whitening vitamins, eyebright lutein, yellow eyes relief, eye beauty supplement, brighter eyes naturally, ocular health support",
    faqs: [
      { question: "How does Sclera White help whiten eyes naturally?", answer: "Sclera White contains Eyebright and Lutein, two powerful ingredients that support ocular tissue health. Lutein helps filter harmful blue light while Eyebright has been traditionally used to reduce eye redness and irritation. Together, they promote brighter, clearer-looking eyes from within." },
      { question: "How long does it take to see results with Sclera White eye whitening supplements?", answer: "Most users begin noticing improvements in eye clarity and brightness within 2-4 weeks of consistent daily use. For optimal results, we recommend taking Sclera White for at least 60-90 days as the nutrients build up in your system to support long-term eye health." },
      { question: "Is Sclera White safe for daily use and are there any side effects?", answer: "Yes, Sclera White is made with natural ingredients in a GMP-certified, FDA-compliant facility in the USA. It contains no artificial colors or harsh chemicals. The formula uses vegetable capsules and is generally well-tolerated. As with any supplement, consult your healthcare provider if you have specific concerns." },
      { question: "What makes Sclera White different from eye whitening drops like Lumify?", answer: "Unlike topical eye drops that provide temporary relief, Sclera White works from within by nourishing your eyes with essential vitamins, antioxidants, and botanicals. It addresses the root causes of eye dullness by supporting overall ocular health with ingredients like Lutein, Zeaxanthin, Bilberry Extract, and Vitamin A." },
      { question: "Can Sclera White help with yellow eyes caused by lifestyle factors?", answer: "Sclera White is formulated to support eye health and may help reduce the appearance of yellowing caused by everyday factors like screen time, lack of sleep, or environmental stress. The antioxidant-rich formula with Lutein and Zeaxanthin helps protect eye tissues from oxidative damage." },
      { question: "What are the key ingredients in Sclera White and their benefits?", answer: "Sclera White features a proprietary blend including Lutein (filters blue light, supports macular health), Eyebright (traditional herb for eye clarity), Bilberry Extract (supports night vision), Zeaxanthin (protects against oxidative stress), plus essential vitamins A, C, E, and B-complex for comprehensive eye nutrition." },
      { question: "How should I take Sclera White for best results?", answer: "Take 2 capsules daily with a meal and a full glass of water. For best absorption, take with a meal containing healthy fats. Consistency is key - take daily for at least 60-90 days to experience the full benefits of the eye-supporting nutrients." },
      { question: "Is Sclera White suitable for contact lens wearers?", answer: "Yes, Sclera White is an oral supplement that works internally to support eye health, so it's perfectly safe for contact lens wearers. Many users find that improved eye health from proper nutrition can make wearing contacts more comfortable." },
      { question: "Can I take Sclera White with other vitamins or medications?", answer: "Sclera White contains vitamins and natural botanicals that are generally safe to combine with other supplements. However, if you're taking prescription medications, especially blood thinners or eye medications, please consult your healthcare provider before starting any new supplement." },
      { question: "Where is Sclera White manufactured and is it quality tested?", answer: "Sclera White is proudly made in Utah, USA, in an FDA-compliant facility following strict GMP (Good Manufacturing Practice) guidelines. Each batch is tested for purity and potency to ensure you receive a safe, high-quality product." },
    ],
    images: imageUrls([
      "/images/products/10786-807/01.png",
      "/images/products/10786-807/02.jpg",
      "/images/products/10786-807/03.jpg",
      "/images/products/10786-807/04.png",
      "/images/products/10786-807/05.png",
      "/images/products/10786-807/06.jpg",
    ]),
    image: `${IMAGE_BASE ? IMAGE_BASE + "/" : "/"}images/products/10786-807/01.png`,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return TOP_PRODUCTS.find((p) => p.slug === slug);
}
