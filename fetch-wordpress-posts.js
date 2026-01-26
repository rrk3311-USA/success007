/**
 * Fetch WordPress Blog Posts
 * Fetches all blog posts from WordPress REST API and saves them to a JSON file
 * 
 * Usage:
 *   node fetch-wordpress-posts.js
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WordPress Configuration
const WORDPRESS_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    apiEndpoint: '/wp-json/wp/v2/posts',
    perPage: 100 // Fetch up to 100 posts per page
};

/**
 * Fetch all blog posts from WordPress
 */
async function fetchAllPosts() {
    console.log('📝 Fetching blog posts from WordPress...');
    console.log(`   URL: ${WORDPRESS_CONFIG.url}${WORDPRESS_CONFIG.apiEndpoint}`);
    
    try {
        let allPosts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const url = `${WORDPRESS_CONFIG.url}${WORDPRESS_CONFIG.apiEndpoint}?per_page=${WORDPRESS_CONFIG.perPage}&page=${page}&_embed=true&status=publish`;
            
            console.log(`   Fetching page ${page}...`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const posts = await response.json();
            
            if (posts.length === 0) {
                hasMore = false;
            } else {
                allPosts = allPosts.concat(posts);
                console.log(`   ✅ Fetched ${posts.length} posts (total: ${allPosts.length})`);
                
                // Check if there are more pages
                const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                if (page >= totalPages) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
        }

        console.log(`\n✅ Successfully fetched ${allPosts.length} blog posts!`);

        // Process and format posts
        const formattedPosts = allPosts.map(post => ({
            id: post.id,
            title: post.title?.rendered || post.title || 'Untitled',
            slug: post.slug,
            excerpt: post.excerpt?.rendered || post.excerpt || '',
            content: post.content?.rendered || post.content || '',
            date: post.date,
            modified: post.modified,
            link: post.link,
            featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                          post.featured_media_url || 
                          post.featured_image_url || 
                          null,
            author: post._embedded?.author?.[0]?.name || post.author_name || 'Success Chemistry',
            categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug
            })) || [],
            tags: post._embedded?.['wp:term']?.[1]?.map(tag => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug
            })) || []
        }));

        // Save to JSON file
        const outputPath = path.join(__dirname, 'deploy-site', 'blog-posts.json');
        fs.writeFileSync(outputPath, JSON.stringify(formattedPosts, null, 2));
        
        console.log(`\n💾 Saved ${formattedPosts.length} posts to: ${outputPath}`);
        console.log(`\n📊 Summary:`);
        console.log(`   - Total posts: ${formattedPosts.length}`);
        console.log(`   - Posts with images: ${formattedPosts.filter(p => p.featuredImage).length}`);
        console.log(`   - Posts with categories: ${formattedPosts.filter(p => p.categories.length > 0).length}`);
        
        return formattedPosts;
        
    } catch (error) {
        console.error('❌ Error fetching WordPress posts:', error.message);
        if (error.message.includes('404')) {
            console.error('\n💡 Tip: Make sure WordPress REST API is enabled.');
            console.error('   Check: https://blueviolet-snake-802946.hostingersite.com/wp-json/wp/v2/posts');
        }
        throw error;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    fetchAllPosts()
        .then(() => {
            console.log('\n✅ Done!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Failed:', error);
            process.exit(1);
        });
}

export { fetchAllPosts, WORDPRESS_CONFIG };
