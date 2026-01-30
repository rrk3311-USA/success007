/**
 * Minimal local server so http://localhost:7001 works (sample only).
 * Run from SCV2: npm run admin:sample
 * Then open http://localhost:7001
 * For real Medusa Admin you need: Postgres + create-medusa-app.
 */
const http = require("http");

const PORT = 7001;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medusa Admin – Sample</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #1a1a2e;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #16213e;
      border-radius: 12px;
      padding: 2rem;
      max-width: 420px;
      border: 1px solid #0f3460;
    }
    h1 { font-size: 1.35rem; margin-bottom: 0.5rem; color: #fff; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem; }
    .badge { display: inline-block; background: #10b981; color: #022c22; font-size: 0.75rem; font-weight: 600; padding: 4px 8px; border-radius: 4px; margin-bottom: 1rem; }
    code { background: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #a5f3fc; }
    a { color: #34d399; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">localhost:${PORT}</span>
    <h1>Medusa Admin – Sample</h1>
    <p>This is a local sample so <strong>http://localhost:${PORT}</strong> works without Postgres.</p>
    <p>For the real Medusa Admin (products, orders, API): install Postgres (or use <a href="https://supabase.com" target="_blank" rel="noopener">Supabase</a> free DB), then run <code>npx create-medusa-app@latest --with-nextjs-starter</code> and start that project. Admin will run on port 7001.</p>
  </div>
</body>
</html>`;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

function start(port) {
  server.listen(port, "127.0.0.1", () => {
    const url = `http://localhost:${port}`;
    console.log("");
    console.log("  Medusa Admin sample is running.");
    console.log("  Open in your browser: " + url);
    console.log("  Leave this terminal open.");
    console.log("");
  });
}

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" || err.code === "EPERM") {
    const alt = 7002;
    console.log("Port " + PORT + " not available, trying " + alt + "...");
    server.listen(alt, "127.0.0.1", () => {
      console.log("");
      console.log("  Open in your browser: http://localhost:" + alt);
      console.log("  Leave this terminal open.");
      console.log("");
    });
  } else {
    console.error(err);
    process.exit(1);
  }
});

start(PORT);
