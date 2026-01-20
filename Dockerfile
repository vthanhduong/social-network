# Stage 1: Install & Build
FROM node:22-alpine AS builder

ARG NEXT_PUBLIC_STREAM_KEY
ARG NEXT_PUBLIC_BASE_URL

WORKDIR /app
COPY package*.json ./

RUN echo "NEXT_PUBLIC_STREAM_KEY=$NEXT_PUBLIC_STREAM_KEY" >> .env && \
  echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env

RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Nextjs standalone cần copy folder static và public riêng
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Chạy bằng file server.js (do mode standalone tạo ra)
CMD ["node", "server.js"]