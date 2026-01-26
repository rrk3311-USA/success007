/**
 * Generate Blog Post Pages
 * Creates individual HTML pages for each blog post from WordPress
 * 
 * Usage:
 *   node generate-blog-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_POSTS_FILE = path.join(__dirname, 'deploy-site', 'blog-posts.json');
const BLOG_OUTPUT_DIR = path.join(__dirname, 'deploy-site', 'blog');

/**
 * Strip HTML tags but keep structure for display
 */
function cleanHtml(html) {
    if (!html) return '';
    // Remove WordPress-specific classes but keep content
    return html
        .replace(/class="wp-block-[^"]*"/g, '')
        .replace(/class="wp-image-[^"]*"/g, '')
        .replace(/data-id="[^"]*"/g, '')
        .replace(/srcset="[^"]*"/g, '')
        .replace(/sizes="[^"]*"/g, '')
        .replace(/loading="[^"]*"/g, '')
        .replace(/decoding="[^"]*"/g, '');
}

/**
 * Convert WordPress image URLs to relative or keep as-is
 */
function processImageUrls(html) {
    if (!html) return '';
    // Keep WordPress image URLs for now (they're hosted there)
    // You can download and host them locally later if needed
    return html;
}

/**
 * Generate HTML page for a blog post
 */
function generateBlogPostPage(post) {
    const cleanContent = processImageUrls(cleanHtml(post.content));
    const excerpt = post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '';
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Success Chemistry</title>
    <meta name="description" content="${excerpt}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://successchemistry.com/blog/${post.slug}">
    ${post.featuredImage ? `<meta property="og:image" content="${post.featuredImage}">` : ''}
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/includes/universal-header.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            color: #1a1a2e;
            line-height: 1.8;
        }

        .blog-post-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .breadcrumb {
            padding: 20px 0;
            font-size: 0.95rem;
            color: #6b7280;
        }

        .breadcrumb a {
            color: #2854a6;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .blog-post-header {
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
        }

        .blog-post-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #0a234e;
            margin-bottom: 20px;
            line-height: 1.3;
        }

        .blog-post-meta {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 0.95rem;
            color: #6b7280;
        }

        .blog-post-meta span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .blog-post-featured-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .blog-post-content {
            font-size: 1.1rem;
            line-height: 1.9;
            color: #374151;
        }

        .blog-post-content h1,
        .blog-post-content h2,
        .blog-post-content h3,
        .blog-post-content h4 {
            color: #0a234e;
            margin-top: 40px;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .blog-post-content h1 { font-size: 2rem; }
        .blog-post-content h2 { font-size: 1.75rem; }
        .blog-post-content h3 { font-size: 1.5rem; }
        .blog-post-content h4 { font-size: 1.25rem; }

        .blog-post-content p {
            margin-bottom: 20px;
        }

        .blog-post-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
        }

        .blog-post-content ul,
        .blog-post-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }

        .blog-post-content li {
            margin-bottom: 10px;
        }

        .blog-post-content a {
            color: #2854a6;
            text-decoration: underline;
        }

        .blog-post-content a:hover {
            color: #1e3f7a;
        }

        .blog-post-footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e9ecef;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .back-to-blog {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #2854a6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s;
        }

        .back-to-blog:hover {
            background: #1e3f7a;
        }

        @media (max-width: 768px) {
            .blog-post-title {
                font-size: 2rem;
            }

            .blog-post-content {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Universal Header -->
    <div id="header-placeholder"></div>

    <div class="blog-post-container">
        <div class="breadcrumb">
            <a href="/">Home</a> › <a href="/blog">Articles</a> › ${post.title}
        </div>

        <article class="blog-post">
            <header class="blog-post-header">
                <h1 class="blog-post-title">${post.title}</h1>
                <div class="blog-post-meta">
                    <span>📅 ${date}</span>
                    ${post.author ? `<span>✍️ ${post.author}</span>` : ''}
                    ${post.categories && post.categories.length > 0 ? `<span>🏷️ ${post.categories.map(c => c.name).join(', ')}</span>` : ''}
                </div>
            </header>

            ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" class="blog-post-featured-image" onerror="this.style.display='none'">` : ''}

            <div class="blog-post-content">
                ${cleanContent}
            </div>

            <footer class="blog-post-footer">
                <a href="/blog" class="back-to-blog">
                    ← Back to Articles
                </a>
            </footer>
        </article>
    </div>

    <!-- Universal Footer -->
    <div id="footer-placeholder"></div>

    <script>
        // Load universal header
        fetch('/includes/universal-header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header-placeholder').innerHTML = html;
            })
            .catch(err => console.error('Error loading header:', err));

        // Load universal footer
        fetch('/includes/universal-footer.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('footer-placeholder').innerHTML = html;
            })
            .catch(err => console.error('Error loading footer:', err));

        // Update cart badge
        function updateCartBadge() {
            const el = document.getElementById('navCartCount');
            if (!el) return;
            const cart = localStorage.getItem('successChemistryCart');
            const cartData = cart ? JSON.parse(cart) : [];
            const count = cartData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
            el.textContent = String(count);
        }
        document.addEventListener('DOMContentLoaded', updateCartBadge);
        window.addEventListener('storage', (e) => {
            if (e.key === 'successChemistryCart') updateCartBadge();
        });
    </script>
</body>
</html>`;
}

/**
 * Main function
 */
async function main() {
    console.log('📝 Generating blog post pages...\n');

    // Read blog posts
    if (!fs.existsSync(BLOG_POSTS_FILE)) {
        console.error(`❌ Blog posts file not found: ${BLOG_POSTS_FILE}`);
        console.log('💡 Run: node fetch-wordpress-posts.js first');
        process.exit(1);
    }

    const posts = JSON.parse(fs.readFileSync(BLOG_POSTS_FILE, 'utf8'));
    console.log(`📚 Found ${posts.length} blog posts\n`);

    // Create blog directory if it doesn't exist
    if (!fs.existsSync(BLOG_OUTPUT_DIR)) {
        fs.mkdirSync(BLOG_OUTPUT_DIR, { recursive: true });
    }

    // Generate pages
    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
        try {
            const slug = post.slug || `post-${post.id}`;
            const outputPath = path.join(BLOG_OUTPUT_DIR, `${slug}.html`);
            
            const html = generateBlogPostPage(post);
            fs.writeFileSync(outputPath, html);
            
            console.log(`✅ Created: ${slug}.html`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error creating page for "${post.title}":`, error.message);
            errorCount++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully created: ${successCount} pages`);
    if (errorCount > 0) {
        console.log(`   ❌ Errors: ${errorCount}`);
    }
    console.log(`\n💡 Blog posts are now available at:`);
    console.log(`   https://successchemistry.com/blog/[slug].html`);
    console.log(`\n💡 Update blog-loader.js to link to these pages`);
}

main().catch(console.error);
