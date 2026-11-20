# syntax=docker/dockerfile:1

# ---- Зависимости (полный набор, включая devDependencies для сборки) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Сборка Next.js ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Рантайм: только продакшен-зависимости ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

# Схема применяется к БД при старте, затем поднимается сервер
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx next start -H 0.0.0.0 -p 3000"]
