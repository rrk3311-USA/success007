import fs from 'fs';

const newDescription = `Sclera White - Premium Eye Whitening & Health Supplement

Transform Your Eye Health Naturally

Sclera White is a premium dietary supplement specifically formulated to promote brighter, healthier-looking eyes. Enriched with clinically-studied ingredients including Eyebright, Lutein, and Zeaxanthin, this powerful formula supports ocular tissue health while helping to reduce eye yellowing and enhance natural eye brightness.

Key Benefits:
• Promotes naturally whiter, brighter eyes
• Supports healthy eye tissue and sclera appearance
• Provides relief from eye yellowing and discoloration
• Contains powerful antioxidants for eye protection
• Supports macular health and visual clarity
• Helps filter harmful blue light exposure
• Reduces eye strain from digital screens
• Promotes overall eye wellness and vitality

Premium Ingredient Formula:

Eyebright Extract - Traditionally used for centuries to support eye health, reduce inflammation, and soothe eye irritation. Known for its natural properties that help maintain clear, bright eyes.

Lutein - A clinically-studied carotenoid found naturally in the macula of the eye. Helps absorb high-energy blue light, reducing the risk of age-related macular degeneration (AMD) and cataracts. Essential for maintaining eye health and visual clarity.

Zeaxanthin - Works synergistically with lutein to protect eye tissues from oxidative damage and support healthy vision.

Bilberry Extract - Rich in anthocyanins and antioxidants that support eye health, improve night vision, and promote healthy blood circulation to the eyes.

Quality You Can Trust:
• Made in Utah, USA
• Manufactured in FDA-compliant, GMP-certified facility
• Organically sourced botanical extracts
• No artificial colors, flavors, or preservatives
• Third-party tested for purity and potency
• Vegetarian capsules

Why Choose Sclera White?

In today's digital age, our eyes are constantly exposed to blue light from screens, environmental stressors, and aging factors that can cause eye yellowing and dullness. Sclera White provides comprehensive nutritional support to help maintain the natural brightness and health of your eyes from within.

Unlike temporary eye drops, Sclera White works at the cellular level to support long-term eye health and appearance. Our unique blend of vitamins, minerals, and botanical extracts nourishes your eyes with the nutrients they need to stay healthy, vibrant, and bright.

Recommended Use:
Take 2 capsules daily with meals for optimal results. Consistent daily use is recommended for best outcomes. Results may vary by individual.

Safety Information:
This product is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use if you are pregnant, nursing, taking medications, or have a medical condition.

Experience the Sclera White Difference - Where Eye Health Meets Natural Beauty`;

const newShortDescription = `Premium eye whitening supplement with Eyebright, Lutein, and Zeaxanthin. Supports naturally brighter, healthier-looking eyes while reducing yellowing and discoloration. Clinically-studied ingredients help protect against blue light, support macular health, and promote overall eye wellness. Made in USA in FDA-compliant, GMP-certified facility.`;

// Read the file
const content = fs.readFileSync('deploy-site/products-data.js', 'utf8');

// Find and replace the description for SKU 10786-807
const regex = /("10786-807":\s*{[^}]*"description":\s*")([^"]*(?:\\.[^"]*)*)(")/s;
const match = content.match(regex);

if (!match) {
    console.error('Could not find SKU 10786-807 description');
    process.exit(1);
}

// Replace description
let updated = content.replace(regex, `$1${newDescription}$3`);

// Replace short_description
const shortRegex = /("10786-807":\s*{[^}]*"short_description":\s*")([^"]*(?:\\.[^"]*)*)(")/s;
updated = updated.replace(shortRegex, `$1${newShortDescription}$3`);

// Write back
fs.writeFileSync('deploy-site/products-data.js', updated, 'utf8');

console.log('✅ Successfully updated Sclera White (SKU 10786-807) description!');
