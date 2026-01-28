/**
 * Convert Markdown Blog Posts to HTML
 * Creates clean, AI-friendly HTML versions of blog content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_CONTENT_DIR = path.join(__dirname, 'blog-content');
const OUTPUT_DIR = path.join(__dirname, 'deploy-site', 'blog-md');

// Simple markdown to HTML converter - preserves structure for AI
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers (must come before other conversions)
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
    
    // Unordered lists (preserve hierarchy)
    const lines = html.split('\n');
    let inList = false;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/^- /)) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            result.push('<li>' + line.substring(2) + '</li>');
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        }
    }
    
    if (inList) {
        result.push('</ul>');
    }
    
    html = result.join('\n');
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    
    // Paragraphs - wrap non-tagged content
    html = html.split('\n\n').map(block => {
        block = block.trim();
        if (!block) return '';
        // Don't wrap if already has HTML tags
        if (block.match(/^<(h[1-6]|ul|ol|li|hr|div)/)) {
            return block;
        }
        // Don't wrap single line breaks
        if (block === '\n') return '';
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n\n');
    
    return html;
}

function extractTitle(markdown) {
    const match = markdown.match(/^# (.+)$/m);
    return match ? match[1] : 'Blog Post';
}

function generateHtmlPage(markdown, filename) {
    const title = extractTitle(markdown);
    const content = markdownToHtml(markdown);
    const slug = filename.replace('.md', '');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Success Chemistry</title>
    <meta name="description" content="${title.substring(0, 160)}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://successchemistry.com/blog-md/${slug}.html">
    
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
        
        .blog-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px 80px;
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
        
        article {
            background: white;
        }
        
        h1 {
            font-size: 2.75rem;
            font-weight: 700;
            color: #0a234e;
            margin-bottom: 30px;
            line-height: 1.2;
        }
        
        h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #0a234e;
            margin: 50px 0 20px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }
        
        h2:first-of-type {
            border-top: none;
            margin-top: 30px;
        }
        
        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e40af;
            margin: 35px 0 15px;
        }
        
        h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #3b82f6;
            margin: 25px 0 12px;
        }
        
        p {
            margin-bottom: 20px;
            font-size: 1.1rem;
            line-height: 1.9;
            color: #374151;
        }
        
        ul, ol {
            margin: 20px 0 20px 30px;
        }
        
        li {
            margin-bottom: 12px;
            font-size: 1.05rem;
            line-height: 1.8;
            color: #374151;
        }
        
        a {
            color: #2854a6;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: border-color 0.2s;
        }
        
        a:hover {
            border-bottom-color: #2854a6;
        }
        
        strong {
            font-weight: 700;
            color: #1a1a2e;
        }
        
        em {
            font-style: italic;
        }
        
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 50px 0;
        }
        
        .back-to-index {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: #2854a6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s;
            margin-top: 50px;
            border: none;
        }
        
        .back-to-index:hover {
            background: #1e3f7a;
        }
        
        @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            h2 { font-size: 1.6rem; }
            h3 { font-size: 1.3rem; }
            h4 { font-size: 1.1rem; }
            p, li { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div id="header-placeholder"></div>
    
    <div class="blog-container">
        <div class="breadcrumb">
            <a href="/">Home</a> › <a href="/blog-md/">Knowledge Base</a> › ${title}
        </div>
        
        <article>
            ${content}
            
            <div style="margin-top: 60px; text-align: center;">
                <a href="/blog-md/" class="back-to-index">← Back to Knowledge Base</a>
            </div>
        </article>
    </div>
    
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
    </script>
</body>
</html>`;
}

async function convertAllBlogs() {
    console.log('🔄 Converting markdown blog posts to HTML...\n');
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Get all markdown files
    const files = fs.readdirSync(BLOG_CONTENT_DIR)
        .filter(f => f.endsWith('.md'));
    
    console.log(`📝 Found ${files.length} markdown files to convert\n`);
    
    let converted = 0;
    
    for (const file of files) {
        try {
            const mdPath = path.join(BLOG_CONTENT_DIR, file);
            const markdown = fs.readFileSync(mdPath, 'utf8');
            
            const htmlFilename = file.replace('.md', '.html');
            const htmlPath = path.join(OUTPUT_DIR, htmlFilename);
            
            const html = generateHtmlPage(markdown, file);
            fs.writeFileSync(htmlPath, html);
            
            console.log(`✅ Converted: ${file} → ${htmlFilename}`);
            converted++;
        } catch (error) {
            console.error(`❌ Error converting ${file}:`, error.message);
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully converted: ${converted} files`);
    console.log(`\n🌐 Blog posts now available at:`);
    console.log(`   https://successchemistry.com/blog-md/[slug].html`);
    console.log(`\n📂 Files saved to: ${OUTPUT_DIR}`);
}

convertAllBlogs().catch(console.error);
