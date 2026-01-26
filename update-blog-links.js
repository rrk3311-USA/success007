import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the blog posts file
const blogPostsPath = path.join(__dirname, 'deploy-site', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Product URL mappings - old WordPress URLs to new product pages
const productMappings = {
    'sclera-white-eye-whitening-vitamin-supplement-with-eyebright-and-lutein-for-natural-eye-brightening-promote-healthier-and-brighter-eyes-naturally': '/product?sku=10786-807',
    'sclera-white': '/product?sku=10786-807',
    // Add more product mappings as needed
};

// Old site base URL
const oldSiteBase = 'https://blueviolet-snake-802946.hostingersite.com';

let updatedCount = 0;

// Function to update links in content
function updateLinks(content) {
    if (!content || typeof content !== 'string') return content;
    
    let updated = content;
    
    // Replace old product URLs with new product pages
    // Pattern: https://blueviolet-snake-802946.hostingersite.com/product/[product-slug]/
    const productUrlPattern = /https:\/\/blueviolet-snake-802946\.hostingersite\.com\/product\/([^\/"']+)\/?/gi;
    
    updated = updated.replace(productUrlPattern, (match, slug) => {
        // Check if we have a mapping for this product
        const normalizedSlug = slug.toLowerCase();
        for (const [key, newUrl] of Object.entries(productMappings)) {
            if (normalizedSlug.includes(key.toLowerCase())) {
                updatedCount++;
                return newUrl;
            }
        }
        // Default: link to shop page if product not found
        updatedCount++;
        return '/shop';
    });
    
    // Replace old shop URLs
    updated = updated.replace(/https:\/\/blueviolet-snake-802946\.hostingersite\.com\/shop\/?/gi, '/shop');
    updated = updated.replace(/https:\/\/blueviolet-snake-802946\.hostingersite\.com\/cart\/?/gi, '/cart');
    updated = updated.replace(/https:\/\/blueviolet-snake-802946\.hostingersite\.com\/?/gi, '/');
    
    // Replace any other old site references in href attributes
    updated = updated.replace(/href=["']https:\/\/blueviolet-snake-802946\.hostingersite\.com[^"']*["']/gi, (match) => {
        if (match.includes('/product/')) {
            // Extract product slug and map it
            const slugMatch = match.match(/\/product\/([^\/"']+)/);
            if (slugMatch) {
                const slug = slugMatch[1].toLowerCase();
                for (const [key, newUrl] of Object.entries(productMappings)) {
                    if (slug.includes(key.toLowerCase())) {
                        updatedCount++;
                        return `href="${newUrl}"`;
                    }
                }
            }
            updatedCount++;
            return 'href="/shop"';
        }
        if (match.includes('/shop')) {
            updatedCount++;
            return 'href="/shop"';
        }
        if (match.includes('/cart')) {
            updatedCount++;
            return 'href="/cart"';
        }
        updatedCount++;
        return 'href="/"';
    });
    
    return updated;
}

// Update all blog posts
blogPosts.forEach((post, index) => {
    if (post.content) {
        const oldContent = post.content;
        post.content = updateLinks(post.content);
        if (oldContent !== post.content) {
            console.log(`Updated links in post: ${post.title || post.id}`);
        }
    }
    
    if (post.excerpt) {
        post.excerpt = updateLinks(post.excerpt);
    }
});

// Write updated blog posts back to file
fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2), 'utf8');

console.log(`\n✅ Updated ${updatedCount} links across ${blogPosts.length} blog posts`);
console.log(`📝 File saved: ${blogPostsPath}`);
