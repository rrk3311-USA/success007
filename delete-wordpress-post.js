/**
 * Delete WordPress Post
 * Deletes a specific post from WordPress using REST API
 * 
 * Usage:
 *   node delete-wordpress-post.js <post-id>
 *   node delete-wordpress-post.js 1
 * 
 * Or delete by title:
 *   node delete-wordpress-post.js "Hello world!"
 */

import fetch from 'node-fetch';

// WordPress Configuration
const WORDPRESS_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    apiEndpoint: '/wp-json/wp/v2/posts',
    // WordPress REST API requires authentication for DELETE
    // You'll need to create an Application Password in WordPress:
    // WordPress Admin → Users → Your Profile → Application Passwords
    // Or use Basic Auth with username:password
    username: '', // Your WordPress username
    password: ''  // Application Password (not your regular password)
};

/**
 * Get authentication header
 * Uses Basic Auth with WordPress username and Application Password
 */
function getAuthHeader() {
    if (!WORDPRESS_CONFIG.username || !WORDPRESS_CONFIG.password) {
        console.error('❌ WordPress credentials not configured!');
        console.log('\n💡 To delete posts, you need to set up authentication:');
        console.log('   1. Go to WordPress Admin → Users → Your Profile');
        console.log('   2. Scroll to "Application Passwords"');
        console.log('   3. Create a new application password');
        console.log('   4. Update WORDPRESS_CONFIG.username and WORDPRESS_CONFIG.password in this script');
        console.log('\n   Or manually delete the post from WordPress Admin → Posts');
        return null;
    }
    return `Basic ${Buffer.from(`${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`).toString('base64')}`;
}

/**
 * Find post by title
 */
async function findPostByTitle(title) {
    const url = `${WORDPRESS_CONFIG.url}${WORDPRESS_CONFIG.apiEndpoint}?search=${encodeURIComponent(title)}&per_page=10`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const posts = await response.json();
        return posts.find(post => 
            post.title?.rendered === title || 
            post.title === title ||
            post.slug === title.toLowerCase().replace(/\s+/g, '-')
        );
    } catch (error) {
        console.error('Error finding post:', error.message);
        return null;
    }
}

/**
 * Delete post by ID
 */
async function deletePost(postId, force = true) {
    const authHeader = getAuthHeader();
    if (!authHeader) {
        return null;
    }
    
    const url = `${WORDPRESS_CONFIG.url}${WORDPRESS_CONFIG.apiEndpoint}/${postId}${force ? '?force=true' : ''}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting post:', error.message);
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🗑️  Delete WordPress Post\n');
        console.log('Usage:');
        console.log('  node delete-wordpress-post.js <post-id>');
        console.log('  node delete-wordpress-post.js "Hello world!"');
        console.log('\nExample:');
        console.log('  node delete-wordpress-post.js 1');
        console.log('  node delete-wordpress-post.js "Hello world!"');
        process.exit(1);
    }
    
    const input = args[0];
    let postId = null;
    let post = null;
    
    // Check if input is a number (post ID) or string (title)
    if (/^\d+$/.test(input)) {
        postId = parseInt(input);
        console.log(`🔍 Looking for post with ID: ${postId}`);
    } else {
        console.log(`🔍 Searching for post with title: "${input}"`);
        post = await findPostByTitle(input);
        
        if (!post) {
            console.log(`❌ Post not found: "${input}"`);
            console.log('   Make sure the title matches exactly.');
            process.exit(1);
        }
        
        postId = post.id;
        console.log(`✅ Found post:`);
        console.log(`   ID: ${post.id}`);
        console.log(`   Title: ${post.title?.rendered || post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Date: ${post.date}`);
    }
    
    console.log(`\n🗑️  Deleting post ID ${postId}...`);
    
    try {
        const authHeader = getAuthHeader();
        if (!authHeader) {
            console.log('\n⚠️  Cannot delete without authentication.');
            console.log('   Please set up WordPress credentials in the script, or');
            console.log('   manually delete the post from WordPress Admin → Posts');
            process.exit(1);
        }
        
        const result = await deletePost(postId, true);
        console.log(`\n✅ Successfully deleted post!`);
        console.log(`   Post ID ${postId} has been permanently removed from WordPress.`);
        console.log(`\n💡 Run 'node fetch-wordpress-posts.js' to update your local cache.`);
    } catch (error) {
        console.error(`\n❌ Failed to delete post: ${error.message}`);
        if (error.message.includes('401') || error.message.includes('403')) {
            console.log('\n💡 Authentication failed. Make sure:');
            console.log('   1. WORDPRESS_CONFIG.username is set correctly');
            console.log('   2. WORDPRESS_CONFIG.password is an Application Password (not your regular password)');
            console.log('   3. Application Password is created in WordPress Admin → Users → Your Profile → Application Passwords');
        }
        process.exit(1);
    }
}

main().catch(console.error);
