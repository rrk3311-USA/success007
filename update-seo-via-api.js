// Update products with SEO content via API
const API_BASE = 'http://localhost:3001';

const seoUpdates = [
    {
        sku: "52274-401",
        seo_title: "Women's Libido Booster | Natural Female Arousal Supplement - Success Chemistry",
        meta_description: "Boost female libido naturally with our Women's Balance supplement. Contains L-Arginine, Maca, Ashwagandha & Ginseng for enhanced arousal, energy & hormonal balance. 60 capsules.",
        short_description: "Premium female libido enhancement supplement with clinically-studied ingredients including L-Arginine, Maca Root, Ashwagandha, and Korean Ginseng. Supports natural arousal, energy levels, and hormonal balance for women.",
        image_alt: "Success Chemistry Women's Balance Libido Supplement Bottle - 60 Capsules"
    },
    {
        sku: "14179-504-2",
        seo_title: "Prostate Supplement 2-Pack | Saw Palmetto & Quercetin for Men - Success Chemistry",
        meta_description: "Natural prostate health support with Saw Palmetto & Quercetin. Reduces nighttime bathroom trips, supports urinary flow & promotes healthy prostate function. 2-pack, 120 capsules total.",
        short_description: "Advanced prostate health formula with Saw Palmetto, Quercetin, and essential nutrients. Clinically-proven ingredients support healthy urinary flow, reduce frequent nighttime trips, and promote optimal prostate function for men over 40.",
        image_alt: "Success Chemistry Prostate Renew Supplement 2-Pack - Natural Prostate Support"
    },
    {
        sku: "10786-807-2",
        seo_title: "Lutein Eye Health Supplement 2-Pack | Vision Support with Zeaxanthin - 120 Caps",
        meta_description: "Protect your vision with Lutein & Zeaxanthin eye health supplements. Supports macular health, reduces blue light damage & promotes clear vision. 2-pack, 120 capsules.",
        short_description: "Premium eye health formula with 20mg Lutein and Zeaxanthin. Protects against blue light damage, supports macular health, and promotes clear vision. Essential nutrients for digital age eye protection.",
        image_alt: "Lutein and Zeaxanthin Eye Health Supplement - 2 Pack 120 Capsules"
    },
    {
        sku: "B072MMW71X-1",
        seo_title: "Hair Growth Supplement | Natural Hair La Fluer with Horsetail & Bamboo Extract",
        meta_description: "Accelerate hair growth naturally with Hair La Fluer Maximum. Island-sourced Horsetail, Bamboo & Peony extract promote stronger, thicker, healthier hair. Vegan-friendly formula.",
        short_description: "Maximum strength hair growth formula with island-sourced botanicals. Horsetail and Bamboo provide natural silica for stronger hair, while Peony extract supports scalp health and promotes thicker, fuller hair growth.",
        image_alt: "Hair La Fluer Maximum Hair Growth Supplement with Natural Botanicals"
    },
    {
        sku: "31412-404U-3",
        seo_title: "UTI Relief 3-Pack | D-Mannose & Cranberry for Urinary Health - 180 Capsules",
        meta_description: "Natural UTI prevention & relief with D-Mannose and Cranberry extract. Supports urinary tract health, prevents infections & promotes bladder wellness. 3-month supply, vegan capsules.",
        short_description: "Powerful urinary tract support with clinically-studied D-Mannose and concentrated Cranberry extract. Prevents UTI recurrence, supports bladder health, and promotes urinary tract wellness. Vegan cellulose capsules, 3-month supply.",
        image_alt: "Success Chemistry UTI Relief 3-Pack - D-Mannose and Cranberry Supplement"
    },
    {
        sku: "1960-102",
        seo_title: "African Mango Extract Drops | Ketogenic Weight Loss Support - 2 fl oz",
        meta_description: "Premium African Mango extract drops for weight management & ketogenic support. Natural metabolism booster, appetite suppressant & energy enhancer. 2 oz liquid formula.",
        short_description: "Concentrated African Mango extract in convenient liquid drops. Supports ketogenic diet, boosts metabolism, reduces appetite, and enhances energy levels. Fast-absorbing liquid formula for maximum effectiveness.",
        image_alt: "Skinny Bean African Mango Extract Drops - Ketogenic Support Formula"
    },
    {
        sku: "10777-810",
        seo_title: "Liver Cleanse Detox Pills | Milk Thistle & Dandelion Root - 60 Capsules",
        meta_description: "Natural liver detox supplement with Milk Thistle, Dandelion Root & Artichoke Extract. Supports liver health, detoxification & digestive wellness. 60 capsules by Success Chemistry.",
        short_description: "Comprehensive liver support formula with Milk Thistle (Silymarin), Dandelion Root, and Artichoke Extract. Promotes natural detoxification, supports healthy liver function, and aids digestive health. Vegetarian capsules.",
        image_alt: "Success Chemistry Liver Cleanse Detox Pills with Milk Thistle - 60 Capsules"
    },
    {
        sku: "783325395333",
        seo_title: "Moringa Oleifera 800mg | Natural Energy & Joint Health Supplement - 60 Caps",
        meta_description: "Pure Moringa Oleifera leaf extract 800mg per serving. Boosts natural energy, supports joint health, improves sleep quality & provides antioxidant protection. 60 capsules.",
        short_description: "Premium Moringa Oleifera leaf extract standardized to 800mg per serving. Rich in vitamins, minerals, and antioxidants. Supports sustained energy, joint flexibility, sleep quality, and overall wellness. Non-GMO, vegan capsules.",
        image_alt: "Success Chemistry Moringa Oleifera 800mg Supplement - Natural Energy Support"
    },
    {
        sku: "B01KB6CKV4",
        seo_title: "Women's Probiotic for Weight Management | Skinny Bean Slimming Formula",
        meta_description: "Specialized women's probiotic for weight management & digestive health. Supports metabolism, gut health & healthy weight loss. Clinically-studied probiotic strains.",
        short_description: "Advanced probiotic formula designed specifically for women's weight management. Contains clinically-studied strains that support metabolism, digestive health, and healthy weight loss. Promotes gut balance and overall wellness.",
        image_alt: "Skinny Bean Women's Probiotic for Weight Management and Slimming"
    },
    {
        sku: "20647-507-3",
        seo_title: "Lung Cleanse Supplement 3-Pack | Natural Respiratory Support - NEW LUNG",
        meta_description: "Natural lung cleanse & respiratory support supplement. Promotes clear breathing, lung health & respiratory wellness. 3-bottle bundle deal for comprehensive lung detox support.",
        short_description: "Comprehensive lung cleanse formula with natural herbs and nutrients. Supports respiratory health, promotes clear breathing, and aids lung detoxification. Ideal for smokers, ex-smokers, or anyone seeking respiratory wellness. 3-month supply.",
        image_alt: "NEW LUNG Cleanse Supplement 3-Pack - Natural Respiratory Support"
    },
    {
        sku: "5531-502",
        seo_title: "Perfect Yoni Women's Probiotic | Vaginal Health pH Balance - 60 Capsules",
        meta_description: "Organic women's probiotic for vaginal health & pH balance. Supports feminine wellness, prevents infections & promotes healthy vaginal flora. 60 capsules by Perfect Yoni.",
        short_description: "Specialized probiotic formula for women's intimate health. Contains beneficial bacteria strains that support vaginal pH balance, prevent yeast infections, and promote optimal feminine wellness. Organic, vegan-friendly capsules.",
        image_alt: "Perfect Yoni Organic Women's Probiotic for Vaginal Health - 60 Capsules"
    },
    {
        sku: "1994-807-1",
        seo_title: "Eye Whitening Supplement | Natural Bright Eyes Formula - EyesWhite",
        meta_description: "Natural eye whitening supplement for brighter, radiant eyes. Reduces redness, supports eye health & promotes clear, white sclera. Safe, effective eye brightening formula.",
        short_description: "Innovative eye whitening supplement with natural ingredients that reduce eye redness and yellowing. Supports clear, bright white sclera and overall eye health. Contains antioxidants and nutrients for radiant, youthful-looking eyes.",
        image_alt: "EyesWhite Eye Whitening Supplement for Bright Radiant Eyes"
    }
];

async function updateProducts() {
    console.log('🚀 Starting SEO content update for all products...\n');
    
    // First, get all products to find their IDs
    const response = await fetch(`${API_BASE}/api/products`);
    const products = await response.json();
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const seoData of seoUpdates) {
        const product = products.find(p => p.sku === seoData.sku);
        
        if (!product) {
            console.log(`❌ Product not found: ${seoData.sku}`);
            errorCount++;
            continue;
        }
        
        try {
            const updateResponse = await fetch(`${API_BASE}/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...product,
                    seo_title: seoData.seo_title,
                    meta_description: seoData.meta_description,
                    short_description: seoData.short_description,
                    image_alt: seoData.image_alt
                })
            });
            
            if (updateResponse.ok) {
                console.log(`✅ Updated: ${product.name.substring(0, 50)}...`);
                successCount++;
            } else {
                console.log(`❌ Failed to update: ${seoData.sku}`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ Error updating ${seoData.sku}:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Successfully updated: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log('═══════════════════════════════════════\n');
}

updateProducts().catch(console.error);
