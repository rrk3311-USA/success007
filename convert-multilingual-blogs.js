/**
 * Convert Multilingual Markdown Blog Posts to HTML
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_CONTENT_DIR = path.join(__dirname, 'blog-content');
const OUTPUT_BASE = path.join(__dirname, 'deploy-site', 'blog-md');

const LANGUAGES = ['es', 'fr', 'de'];

function markdownToHtml(markdown) {
    let html = markdown;
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
    
    const lines = html.split('\n');
    let inList = false;
    let result = [];
    
    for (let line of lines) {
        if (line.match(/^- /)) {
            if (!inList) { result.push('<ul>'); inList = true; }
            result.push('<li>' + line.substring(2) + '</li>');
        } else {
            if (inList) { result.push('</ul>'); inList = false; }
            result.push(line);
        }
    }
    if (inList) result.push('</ul>');
    
    html = result.join('\n');
    html = html.replace(/^---$/gm, '<hr>');
    html = html.split('\n\n').map(block => {
        block = block.trim();
        if (!block || block.match(/^<(h[1-6]|ul|ol|li|hr|div)/)) return block;
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n\n');
    
    return html;
}

function extractTitle(markdown) {
    const match = markdown.match(/^# (.+)$/m);
    return match ? match[1] : 'Blog Post';
}

function generateHtmlPage(markdown, filename, lang) {
    const title = extractTitle(markdown);
    const content = markdownToHtml(markdown);
    const slug = filename.replace('.md', '');
    
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Success Chemistry</title>
    <meta name="description" content="${title.substring(0, 160)}">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="/includes/universal-header.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', -apple-system, sans-serif; background: white; color: #1a1a2e; line-height: 1.8; }
        .blog-container { max-width: 900px; margin: 0 auto; padding: 40px 20px 80px; }
        h1 { font-size: 2.5rem; font-weight: 700; color: #0a234e; margin-bottom: 30px; }
        h2 { font-size: 1.8rem; font-weight: 700; color: #0a234e; margin: 40px 0 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
        h3 { font-size: 1.4rem; font-weight: 600; color: #1e40af; margin: 30px 0 15px; }
        h4 { font-size: 1.2rem; font-weight: 600; color: #3b82f6; margin: 20px 0 10px; }
        p { margin-bottom: 20px; font-size: 1.05rem; line-height: 1.8; color: #374151; }
        ul { margin: 20px 0 20px 30px; }
        li { margin-bottom: 10px; font-size: 1rem; color: #374151; }
        a { color: #2854a6; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        strong { font-weight: 700; color: #1a1a2e; }
        hr { border: none; border-top: 2px solid #e5e7eb; margin: 40px 0; }
        .back-link { display: inline-block; padding: 12px 24px; background: #2854a6; color: white; text-decoration: none; border-radius: 8px; margin-top: 40px; }
        .back-link:hover { background: #1e3f7a; }
    </style>
</head>
<body>
    <div id="header-placeholder"></div>
    <div class="blog-container">
        <article>${content}
            <div style="margin-top: 50px; text-align: center;">
                <a href="/blog-md/${lang}/" class="back-link">← Retour</a>
            </div>
        </article>
    </div>
    <div id="footer-placeholder"></div>
    <script>
        fetch('/includes/universal-header.html').then(r => r.text()).then(h => document.getElementById('header-placeholder').innerHTML = h);
        fetch('/includes/universal-footer.html').then(r => r.text()).then(h => document.getElementById('footer-placeholder').innerHTML = h);
    </script>
</body>
</html>`;
}

async function convertAll() {
    console.log('🌍 Converting multilingual blog posts to HTML...\n');
    
    let totalConverted = 0;
    
    for (const lang of LANGUAGES) {
        const langDir = path.join(BLOG_CONTENT_DIR, lang);
        const outputDir = path.join(OUTPUT_BASE, lang);
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));
        console.log(`📝 ${lang.toUpperCase()}: Converting ${files.length} files...`);
        
        for (const file of files) {
            const mdPath = path.join(langDir, file);
            const markdown = fs.readFileSync(mdPath, 'utf8');
            const htmlFilename = file.replace('.md', '.html');
            const htmlPath = path.join(outputDir, htmlFilename);
            const html = generateHtmlPage(markdown, file, lang);
            fs.writeFileSync(htmlPath, html);
            console.log(`  ✅ ${file} → ${lang}/${htmlFilename}`);
            totalConverted++;
        }
        console.log('');
    }
    
    console.log(`📊 Total converted: ${totalConverted} multilingual pages`);
    console.log(`🌐 Available at: https://successchemistry.com/blog-md/[lang]/[slug].html`);
}

convertAll().catch(console.error);
