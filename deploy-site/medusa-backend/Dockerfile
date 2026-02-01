# Production Dockerfile for Medusa v2 backend.
# Build creates .medusa/server inside the image so it exists at runtime (fixes Render native build).
# Railway: free tier has ~5 min build timeout; Pro ($5/mo) gives 60 min. Use cache mounts to speed builds.
FROM node:20-alpine

# Medusa docs recommend /server to avoid admin path conflicts
WORKDIR /server

# Dependencies (Railway cache requires hardcoded service ID; omitted to avoid "not prefixed with cache key". Pro gives 60 min build.)
COPY package.json package-lock.json* ./
COPY .npmrc* ./
RUN npm ci

# App source and config
COPY medusa-config.ts tsconfig.json instrumentation.ts ./
COPY src ./src

# Build (outputs to .medusa/server)
RUN npm run build

# Install production deps for the built server
RUN cd .medusa/server && npm ci --omit=dev

EXPOSE 9000

# Migrations need DATABASE_URL at runtime; then start from built server.
# Railway sets PORT; Medusa reads it. HOST=0.0.0.0 so the server is reachable (default localhost would cause "Application failed to respond").
# Echo markers so deploy logs show where startup fails (migrations vs server start).
CMD ["sh", "-c", "echo '[MEDUSA] Starting migrations' && npx medusa db:migrate && echo '[MEDUSA] Migrations done, starting server (PORT='$PORT')' && cd .medusa/server && HOST=0.0.0.0 npm start"]
