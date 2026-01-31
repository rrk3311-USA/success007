# Production Dockerfile for Medusa v2 backend.
# Build creates .medusa/server inside the image so it exists at runtime (fixes Render native build).
FROM node:20-alpine

# Medusa docs recommend /server to avoid admin path conflicts
WORKDIR /server

# Dependencies
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

# Migrations need DATABASE_URL at runtime; then start from built server
CMD ["sh", "-c", "npx medusa db:migrate && cd .medusa/server && npm start"]
