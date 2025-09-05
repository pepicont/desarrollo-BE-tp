# Base image
FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.2 --activate

# Install dependencies (dev for build)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy sources and build
COPY . .
RUN pnpm run build

# Production image with only runtime deps
FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.6.2 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder
COPY --from=base /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]
