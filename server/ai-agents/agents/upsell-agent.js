/**
 * UPSELL AGENT
 * Recommend bundles/stacks in cart, checkout, and email
 * Focus: Increase AOV, create compelling product combinations
 */

export class UpsellAgent {
  constructor(db, metrics) {
    this.db = db;
    this.metrics = metrics;
    this.bundleDiscount = 0.10; // 10% bundle discount
  }

  /**
   * Create intelligent product bundles and stacks
   */
  async create_bundle(params) {
    const { task } = params;
    
    // Parse task to identify target products
    const targetProducts = this.parseProductsFromTask(task);
    
    // Generate bundle based on product synergies
    const bundle = await this.generateBundle(targetProducts);
    
    return bundle;
  }

  /**
   * Generate personalized cart upsells
   */
  async generate_cart_upsells(cartItems) {
    const upsells = [];

    for (const item of cartItems) {
      const product = await this.getProduct(item.sku);
      const recommendations = await this.findComplementaryProducts(product);
      
      upsells.push({
        trigger: product.name,
        recommendations: recommendations.map(rec => ({
          sku: rec.sku,
          name: rec.name,
          price: rec.price,
          reason: rec.reason,
          discount: this.bundleDiscount,
          finalPrice: (parseFloat(rec.price) * (1 - this.bundleDiscount)).toFixed(2),
          cta: `Add ${rec.name} - Save 10%!`,
        })),
      });
    }

    return upsells;
  }

  /**
   * Generate checkout page bundle offers
   */
  async generate_checkout_offers(cartTotal, cartItems) {
    const offers = [];

    // Offer 1: Free shipping threshold
    const freeShippingThreshold = 75;
    if (cartTotal < freeShippingThreshold) {
      const needed = freeShippingThreshold - cartTotal;
      offers.push({
        type: 'free_shipping',
        message: `Add $${needed.toFixed(2)} more for FREE SHIPPING! 🚚`,
        products: await this.getProductsUnderPrice(needed + 10),
      });
    }

    // Offer 2: Bundle upgrade
    const bundleOffer = await this.createBundleUpgrade(cartItems);
    if (bundleOffer) {
      offers.push(bundleOffer);
    }

    // Offer 3: Subscription conversion
    offers.push({
      type: 'subscription',
      message: '💰 Subscribe & Save 15% on this order + all future orders!',
      savings: (cartTotal * 0.15).toFixed(2),
      cta: 'Convert to Subscription',
    });

    return offers;
  }

  /**
   * Generate email upsell campaigns
   */
  async generate_email_upsells(customerEmail) {
    const customer = await this.getCustomer(customerEmail);
    const purchaseHistory = await this.getPurchaseHistory(customerEmail);
    
    const emailCampaign = {
      subject: '🔥 Complete Your Stack - Exclusive Offer Inside!',
      recommendations: [],
      personalizedMessage: '',
    };

    // Analyze what they've bought and suggest complementary products
    const boughtCategories = this.analyzeCategories(purchaseHistory);
    const missingProducts = await this.findGapsInStack(boughtCategories);

    emailCampaign.recommendations = missingProducts.map(product => ({
      name: product.name,
      price: product.price,
      reason: product.reason,
      benefit: product.benefit,
      discount: '15% off for you!',
    }));

    emailCampaign.personalizedMessage = this.generatePersonalizedMessage(customer, boughtCategories);

    return emailCampaign;
  }

  /**
   * Generate intelligent product bundles
   */
  async generateBundle(targetProducts) {
    // Example: Energy Stack Bundle
    const energyStack = {
      name: '⚡ Peak Energy Stack',
      description: 'Scientifically formulated for sustained energy, focus, and performance',
      products: [
        { sku: 'CREATINE-MONO-500G', name: 'Creatine Monohydrate 500g', role: 'Power & Strength' },
        { sku: 'CAFFEINE-200MG', name: 'Caffeine 200mg', role: 'Energy & Focus' },
        { sku: 'BCAA-POWDER', name: 'BCAA Powder', role: 'Recovery & Endurance' },
        { sku: 'B-COMPLEX', name: 'B-Complex Vitamins', role: 'Energy Metabolism' },
      ],
      pricing: {
        individualTotal: 0,
        bundlePrice: 0,
        savings: 0,
        savingsPercent: 10,
      },
      benefits: [
        '✅ Sustained energy without crashes',
        '✅ Enhanced mental clarity and focus',
        '✅ Improved workout performance',
        '✅ Faster recovery between sessions',
        '✅ Optimal nutrient timing',
      ],
      usage: {
        morning: 'B-Complex + Caffeine',
        preworkout: 'Creatine + BCAA',
        postworkout: 'BCAA',
      },
      compliance: {
        claims: 'compliant',
        warnings: 'Consult healthcare provider before use',
      },
    };

    // Calculate pricing
    let total = 0;
    for (const product of energyStack.products) {
      const productData = await this.getProductBySKU(product.sku);
      if (productData) {
        total += parseFloat(productData.price);
      }
    }

    energyStack.pricing.individualTotal = total.toFixed(2);
    energyStack.pricing.bundlePrice = (total * (1 - this.bundleDiscount)).toFixed(2);
    energyStack.pricing.savings = (total * this.bundleDiscount).toFixed(2);

    return energyStack;
  }

  /**
   * Find complementary products based on synergies
   */
  async findComplementaryProducts(product) {
    const complementaryMap = {
      'creatine': ['protein', 'bcaa', 'pre-workout'],
      'protein': ['creatine', 'bcaa', 'glutamine'],
      'pre-workout': ['bcaa', 'creatine', 'beta-alanine'],
      'multivitamin': ['omega-3', 'vitamin-d', 'magnesium'],
      'nootropic': ['omega-3', 'b-complex', 'caffeine'],
      'sleep': ['magnesium', 'melatonin', 'ashwagandha'],
    };

    const category = this.detectCategory(product.name.toLowerCase());
    const complementaryCategories = complementaryMap[category] || [];

    const recommendations = [];
    for (const cat of complementaryCategories) {
      const products = await this.getProductsByCategory(cat);
      if (products.length > 0) {
        recommendations.push({
          ...products[0],
          reason: this.getComplementaryReason(category, cat),
        });
      }
    }

    return recommendations.slice(0, 3); // Top 3 recommendations
  }

  /**
   * Create bundle upgrade offer
   */
  async createBundleUpgrade(cartItems) {
    if (cartItems.length < 2) return null;

    const categories = cartItems.map(item => this.detectCategory(item.name));
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length >= 2) {
      return {
        type: 'bundle_upgrade',
        message: '🎁 You\'re building a stack! Add one more product and save 10% on everything!',
        currentSavings: 0,
        potentialSavings: this.calculateBundleSavings(cartItems),
        cta: 'Complete My Stack',
      };
    }

    return null;
  }

  // Helper methods
  async getProduct(sku) {
    const stmt = this.db.prepare('SELECT * FROM products WHERE sku = ?');
    return stmt.get(sku);
  }

  async getProductBySKU(sku) {
    const stmt = this.db.prepare('SELECT * FROM products WHERE sku LIKE ?');
    return stmt.get(`%${sku}%`);
  }

  async getProductsByCategory(category) {
    const stmt = this.db.prepare('SELECT * FROM products WHERE LOWER(name) LIKE ? OR LOWER(category) LIKE ? LIMIT 3');
    return stmt.all(`%${category}%`, `%${category}%`);
  }

  async getProductsUnderPrice(maxPrice) {
    const stmt = this.db.prepare('SELECT * FROM products WHERE CAST(price AS REAL) <= ? ORDER BY price DESC LIMIT 5');
    return stmt.all(maxPrice);
  }

  async getCustomer(email) {
    const stmt = this.db.prepare('SELECT * FROM customers WHERE email = ?');
    return stmt.get(email);
  }

  async getPurchaseHistory(email) {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC');
    return stmt.all(email);
  }

  parseProductsFromTask(task) {
    const keywords = task.toLowerCase().match(/creatine|protein|energy|focus|sleep|recovery/g) || [];
    return [...new Set(keywords)];
  }

  detectCategory(productName) {
    const categories = {
      creatine: ['creatine'],
      protein: ['protein', 'whey', 'casein'],
      'pre-workout': ['pre-workout', 'pre workout', 'preworkout'],
      bcaa: ['bcaa', 'amino'],
      multivitamin: ['multivitamin', 'multi-vitamin'],
      nootropic: ['nootropic', 'focus', 'brain'],
      sleep: ['sleep', 'melatonin'],
      omega: ['omega', 'fish oil'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => productName.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  analyzeCategories(purchases) {
    return purchases.map(p => this.detectCategory(p.product_name || ''));
  }

  async findGapsInStack(boughtCategories) {
    const idealStacks = {
      performance: ['protein', 'creatine', 'pre-workout', 'bcaa'],
      wellness: ['multivitamin', 'omega-3', 'vitamin-d', 'probiotics'],
      cognitive: ['nootropic', 'omega-3', 'b-complex', 'caffeine'],
    };

    const gaps = [];
    for (const [stackName, products] of Object.entries(idealStacks)) {
      const missing = products.filter(p => !boughtCategories.includes(p));
      if (missing.length > 0 && missing.length < products.length) {
        for (const category of missing) {
          const product = await this.getProductsByCategory(category);
          if (product.length > 0) {
            gaps.push({
              ...product[0],
              reason: `Complete your ${stackName} stack`,
              benefit: `Maximize your ${stackName} results`,
            });
          }
        }
      }
    }

    return gaps.slice(0, 3);
  }

  generatePersonalizedMessage(customer, categories) {
    const name = customer.name || 'there';
    return `Hey ${name}! 👋 We noticed you're focused on ${categories[0]} supplementation. Here are some science-backed additions to maximize your results...`;
  }

  getComplementaryReason(mainCategory, complementCategory) {
    const reasons = {
      'creatine-protein': 'Protein enhances muscle recovery while creatine boosts strength',
      'creatine-bcaa': 'BCAAs reduce muscle breakdown during intense creatine-fueled workouts',
      'protein-bcaa': 'BCAAs optimize protein synthesis for maximum muscle growth',
      'nootropic-omega-3': 'Omega-3s support brain health and enhance cognitive function',
    };

    return reasons[`${mainCategory}-${complementCategory}`] || 'Perfect complement to your current stack';
  }

  calculateBundleSavings(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    return (total * this.bundleDiscount).toFixed(2);
  }
}
