/**
 * Remove Duplicate Blog Posts
 * Removes duplicate blog posts, keeping the most recent/most complete version
 * 
 * Usage:
 *   node remove-duplicate-blogs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_POSTS_FILE = path.join(__dirname, 'deploy-site', 'blog-posts.json');

/**
 * Find duplicate groups by similar titles
 */
function findDuplicateGroups(posts) {
    const groups = {};
    posts.forEach((post, index) => {
        // Use first 40 characters of title as key
        const key = post.title.toLowerCase().substring(0, 40).trim();
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push({ index, post });
    });
    
    return Object.values(groups).filter(g => g.length > 1);
}

/**
 * Main function
 */
async function main() {
    console.log('🔍 Finding and removing duplicate blog posts...\n');

    if (!fs.existsSync(BLOG_POSTS_FILE)) {
        console.error(`❌ Blog posts file not found: ${BLOG_POSTS_FILE}`);
        process.exit(1);
    }

    const posts = JSON.parse(fs.readFileSync(BLOG_POSTS_FILE, 'utf8'));
    console.log(`📚 Total posts: ${posts.length}\n`);

    const duplicateGroups = findDuplicateGroups(posts);
    
    if (duplicateGroups.length === 0) {
        console.log('✅ No duplicates found!');
        return;
    }

    console.log(`🔍 Found ${duplicateGroups.length} duplicate groups\n`);

    const idsToRemove = new Set();
    let removedCount = 0;

    duplicateGroups.forEach((group, groupIndex) => {
        console.log(`Group ${groupIndex + 1}: "${group[0].post.title.substring(0, 60)}..."`);
        
        // Sort by date (newest first) and content length (longest first)
        const sorted = group.sort((a, b) => {
            const dateA = new Date(a.post.date);
            const dateB = new Date(b.post.date);
            // First sort by date (newest first)
            if (dateB - dateA !== 0) {
                return dateB - dateA;
            }
            // Then by content length (longest first)
            return b.post.content.length - a.post.content.length;
        });
        
        // Keep the first one (newest/most complete)
        const keep = sorted[0];
        const remove = sorted.slice(1);
        
        console.log(`  ✅ Keeping: ID ${keep.post.id} (${keep.post.date.substring(0, 10)}, ${keep.post.content.length} chars)`);
        
        remove.forEach(r => {
            console.log(`  ❌ Removing: ID ${r.post.id} (${r.post.date.substring(0, 10)}, ${r.post.content.length} chars)`);
            idsToRemove.add(r.post.id);
            removedCount++;
        });
        console.log('');
    });

    // Remove duplicates
    const filteredPosts = posts.filter(post => !idsToRemove.has(post.id));

    // Save updated posts
    fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(filteredPosts, null, 2));

    console.log(`\n📊 Summary:`);
    console.log(`   Posts before: ${posts.length}`);
    console.log(`   Posts after: ${filteredPosts.length}`);
    console.log(`   Removed: ${removedCount} duplicate posts`);
    console.log(`\n💾 Saved to: ${BLOG_POSTS_FILE}`);
}

main().catch(console.error);
