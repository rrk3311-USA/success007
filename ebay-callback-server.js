/**
 * eBay OAuth Callback Server
 * 
 * Captures the authorization code from eBay's OAuth redirect
 * 
 * Usage:
 *   1. Run: node ebay-callback-server.js
 *   2. Update config.js REDIRECT_URI to: http://localhost:3000/ebay/callback
 *   3. Regenerate auth URL: node ebay-oauth-helper.js generate-url
 *   4. Visit the URL and authorize
 *   5. Code will be printed here
 */

import http from "http";
import url from "url";

const PORT = 3000;

http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    
    console.log("\n" + "=".repeat(60));
    console.log("eBay OAuth Callback Received");
    console.log("=".repeat(60));
    console.log("URL:", req.url);
    console.log("Query params:", JSON.stringify(query, null, 2));
    console.log("");
    
    if (query.code) {
        console.log("✅ Authorization Code Found!");
        console.log("");
        console.log("Code:", query.code);
        console.log("");
        console.log("=".repeat(60));
        console.log("Next Step:");
        console.log("=".repeat(60));
        console.log(`node ebay-oauth-helper.js exchange-code ${query.code}`);
        console.log("");
        
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`✅ Authorization Code Received!\n\nCode: ${query.code}\n\nCopy and run:\nnode ebay-oauth-helper.js exchange-code ${query.code}\n\nYou can close this window.\n`);
    } else if (query.error) {
        console.log("❌ OAuth Error:", query.error);
        console.log("Description:", query.error_description || "N/A");
        
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`❌ OAuth Error: ${query.error}\n${query.error_description || ""}\n`);
    } else {
        console.log("⚠️  No code or error in callback");
        
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("No authorization code found in callback URL.\nCheck the browser URL for ?code=...\n");
    }
}).listen(PORT, () => {
    console.log("=".repeat(60));
    console.log("eBay OAuth Callback Server");
    console.log("=".repeat(60));
    console.log(`Listening on http://localhost:${PORT}/ebay/callback`);
    console.log("");
    console.log("Ready to receive OAuth callback...");
    console.log("(Press Ctrl+C to stop)");
    console.log("");
});
