# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

ARG NEXT_PUBLIC_STREAM_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG POSTGRES_URL_NON_POOLING
ARG POSTGRES_PRISMA_URL

RUN echo "NEXT_PUBLIC_STREAM_KEY=${NEXT_PUBLIC_STREAM_KEY}" >> .env && \
  echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}" >> .env && \
  echo "POSTGRES_URL_NON_POOLING=${POSTGRES_URL_NON_POOLING}" >> .env && \
  echo "POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}" >> .env

RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]