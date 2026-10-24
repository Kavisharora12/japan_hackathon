# ── Stage 1: Build & Dependencies ──────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Runtime ───────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=development \
    CI=1 \
    EXPO_NO_TELEMETRY=1 \
    PORT=8081

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
