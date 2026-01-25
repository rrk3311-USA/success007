/**
 * Blog Posts Loader
 * Loads and displays WordPress blog posts on the articles page
 */

// WordPress API Configuration
const WORDPRESS_API = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    endpoint: '/wp-json/wp/v2/posts',
    perPage: 50
};

// New site configuration
const NEW_SITE_URL = 'https://successchemistry.com';
const OLD_SITE_URL = 'https://blueviolet-snake-802946.hostingersite.com';

/**
 * Convert WordPress URL to new site URL
 * Links to individual blog post pages hosted on the new site
 */
function convertToNewSiteUrl(oldUrl, slug) {
    if (!slug) {
        // Try to extract slug from URL
        if (oldUrl) {
            const urlMatch = oldUrl.match(/\/[^\/]+\/([^\/]+)\/?$/);
            if (urlMatch && urlMatch[1]) {
                slug = urlMatch[1];
            }
        }
    }
    
    if (slug) {
        // Link to individual blog post page on new site
        return `/blog/${slug}.html`;
    }
    
    // Fallback to blog listing page
    return '/blog';
}

/**
 * Fetch blog posts from WordPress API
 */
async function fetchBlogPosts() {
    try {
        // Try to load from local JSON file first (faster, cached)
        try {
            const response = await fetch('/blog-posts.json');
            if (response.ok) {
                const posts = await response.json();
                console.log(`✅ Loaded ${posts.length} blog posts from cache`);
                return posts;
            }
        } catch (e) {
            console.log('📝 Cache not available, fetching from WordPress...');
        }

        // Fallback: Fetch directly from WordPress API
        const url = `${WORDPRESS_API.url}${WORDPRESS_API.endpoint}?per_page=${WORDPRESS_API.perPage}&_embed=true&status=publish`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const posts = await response.json();
        console.log(`✅ Fetched ${posts.length} blog posts from WordPress`);
        
        // Format posts and convert URLs to new site
        return posts.map(post => {
            const slug = post.slug;
            const oldLink = post.link;
            const newLink = convertToNewSiteUrl(oldLink, slug);
            
            return {
                id: post.id,
                title: post.title?.rendered || post.title || 'Untitled',
                slug: slug,
                excerpt: post.excerpt?.rendered || post.excerpt || '',
                content: post.content?.rendered || post.content || '',
                date: post.date,
                modified: post.modified,
                link: newLink, // Link to new site blog post page
                originalLink: oldLink, // Keep original for reference
                featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                              post.featured_media_url || 
                              null,
                author: post._embedded?.author?.[0]?.name || 'Success Chemistry',
                categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug
                })) || []
            };
        });
        
    } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        return [];
    }
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get excerpt from content (fallback if no excerpt)
 */
function getExcerpt(content, maxLength = 150) {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Render blog posts to the page
 */
function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid') || document.getElementById('blogGrid');
    if (!blogGrid) {
        console.error('❌ Blog grid not found');
        return;
    }

    // Clear existing sample posts
    blogGrid.innerHTML = '';

    if (posts.length === 0) {
        blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">
                <p>No blog posts found.</p>
            </div>
        `;
        return;
    }

    // Fallback images for posts without featured images (rotate through different ones)
    const fallbackImages = [
        '/public/images/home/lab.jpg',
        '/public/images/home/hero-tech.jpg',
        '/public/images/home/fda-compliant.png',
        '/images/home/lab.jpg',
        '/images/home/hero-tech.jpg'
    ];
    
    // Render each post
    posts.forEach((post, index) => {
        const excerpt = stripHtml(post.excerpt) || getExcerpt(post.content);
        const date = formatDate(post.date);
        
        // Use featured image if available, otherwise use rotating fallback
        const imageUrl = post.featuredImage || fallbackImages[index % fallbackImages.length];
        
        const card = document.createElement('article');
        card.className = 'blog-card';
        // Link to individual blog post page on new site
        const linkUrl = post.link || (post.slug ? `/blog/${post.slug}.html` : '/blog');
        card.innerHTML = `
            <a href="${linkUrl}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${imageUrl}" alt="${post.title}" loading="lazy" onerror="this.src='${fallbackImages[0]}'; this.onerror=null;">
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <p>${excerpt}</p>
                    <div style="margin-top: 12px; font-size: 0.85rem; color: #6b7280;">
                        <span>📅 ${date}</span>
                        ${post.categories.length > 0 ? `<span style="margin-left: 12px;">🏷️ ${post.categories[0].name}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
        
        blogGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${posts.length} blog posts`);
}

/**
 * Initialize blog page
 */
async function initBlogPage() {
    console.log('📝 Initializing blog page...');
    
    const posts = await fetchBlogPosts();
    
    if (posts.length > 0) {
        renderBlogPosts(posts);
    } else {
        console.warn('⚠️ No posts found, keeping sample content');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPage);
} else {
    initBlogPage();
}

// Export for manual use
window.BlogLoader = {
    fetchPosts: fetchBlogPosts,
    renderPosts: renderBlogPosts,
    init: initBlogPage
};
