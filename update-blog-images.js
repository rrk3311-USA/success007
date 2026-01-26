/**
 * Update Blog Post Images
 * Extracts images from blog post content and updates featuredImage field
 * 
 * Usage:
 *   node update-blog-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_POSTS_FILE = path.join(__dirname, 'deploy-site', 'blog-posts.json');

/**
 * Extract first image URL from HTML content
 */
function extractFirstImage(html) {
    if (!html) return null;
    
    // Try to find img tag with src
    const imgMatch = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
    if (imgMatch && imgMatch[1]) {
        let imageUrl = imgMatch[1];
        // Clean up URL (remove query params, fragments)
        imageUrl = imageUrl.split('?')[0].split('#')[0];
        return imageUrl;
    }
    
    // Try to find figure with img
    const figureMatch = html.match(/<figure[^>]*>[\s\S]*?<img[^>]+src=['"]([^'"]+)['"]/i);
    if (figureMatch && figureMatch[1]) {
        let imageUrl = figureMatch[1];
        imageUrl = imageUrl.split('?')[0].split('#')[0];
        return imageUrl;
    }
    
    return null;
}

/**
 * Extract all images from HTML content
 */
function extractAllImages(html) {
    if (!html) return [];
    
    const images = [];
    const imgRegex = /<img[^>]+src=['"]([^'"]+)['"]/gi;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
        let imageUrl = match[1];
        // Clean up URL
        imageUrl = imageUrl.split('?')[0].split('#')[0];
        // Skip data URIs and very small images
        if (!imageUrl.startsWith('data:') && imageUrl.length > 10) {
            images.push(imageUrl);
        }
    }
    
    return images;
}

/**
 * Get best image for featured image
 * Prefers larger images, avoids thumbnails
 */
function getBestImage(images) {
    if (!images || images.length === 0) return null;
    
    // Prefer images that look like featured images (not thumbnails)
    const featuredImages = images.filter(img => {
        const url = img.toLowerCase();
        // Avoid thumbnail indicators
        return !url.includes('-150x') && 
               !url.includes('-300x') && 
               !url.includes('thumbnail') &&
               !url.includes('icon');
    });
    
    if (featuredImages.length > 0) {
        return featuredImages[0];
    }
    
    // Fallback to first image
    return images[0];
}

/**
 * Main function
 */
async function main() {
    console.log('🖼️  Updating blog post images...\n');

    if (!fs.existsSync(BLOG_POSTS_FILE)) {
        console.error(`❌ Blog posts file not found: ${BLOG_POSTS_FILE}`);
        process.exit(1);
    }

    const posts = JSON.parse(fs.readFileSync(BLOG_POSTS_FILE, 'utf8'));
    console.log(`📚 Processing ${posts.length} blog posts\n`);

    let updatedCount = 0;
    let alreadyHadImage = 0;
    let noImageFound = 0;

    const updatedPosts = posts.map(post => {
        // If already has featured image, keep it
        if (post.featuredImage) {
            alreadyHadImage++;
            return post;
        }

        // Try to extract image from content
        const allImages = extractAllImages(post.content);
        const bestImage = getBestImage(allImages);

        if (bestImage) {
            updatedCount++;
            console.log(`✅ ${post.title.substring(0, 50)}...`);
            console.log(`   Image: ${bestImage.substring(0, 80)}...`);
            return {
                ...post,
                featuredImage: bestImage
            };
        } else {
            noImageFound++;
            console.log(`⚠️  ${post.title.substring(0, 50)}...`);
            console.log(`   No image found in content`);
            return post;
        }
    });

    // Save updated posts
    fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(updatedPosts, null, 2));

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated with images: ${updatedCount}`);
    console.log(`   ✅ Already had images: ${alreadyHadImage}`);
    console.log(`   ⚠️  No images found: ${noImageFound}`);
    console.log(`\n💾 Saved to: ${BLOG_POSTS_FILE}`);
}

main().catch(console.error);
