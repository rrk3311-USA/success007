# Production Dockerfile for Medusa v2 backend.
# Build creates .medusa/server inside the image so it exists at runtime (fixes Render native build).
# Railway: free tier has ~5 min build timeout; Pro ($5/mo) gives 60 min. Use cache mounts to speed builds.
FROM node:20-alpine

# Medusa docs recommend /server to avoid admin path conflicts
WORKDIR /server

# Dependencies (cache npm to speed rebuilds and reduce timeout risk)
COPY package.json package-lock.json* ./
COPY .npmrc* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# App source and config
COPY medusa-config.ts tsconfig.json instrumentation.ts ./
COPY src ./src

# Build (outputs to .medusa/server)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Install production deps for the built server
RUN --mount=type=cache,target=/root/.npm \
    cd .medusa/server && npm ci --omit=dev

EXPOSE 9000

# Migrations need DATABASE_URL at runtime; then start from built server
CMD ["sh", "-c", "npx medusa db:migrate && cd .medusa/server && npm start"]
