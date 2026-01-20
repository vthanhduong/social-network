# =========================
# 1. Builder stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package.json package-lock.json ./

# Force install (đúng yêu cầu)
RUN npm install --force

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone)
RUN npm run build


# =========================
# 2. Runner stage
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static & public (Next standalone KHÔNG tự copy)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma client & schema (cần cho runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Next standalone entry
CMD ["node", "server.js"]