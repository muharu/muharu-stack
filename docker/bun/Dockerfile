# Builder Stage
FROM oven/bun:1.1.33-alpine AS base

FROM base AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy application code
COPY . .

# Build the application
RUN bun run build:remix
RUN bun run build:bun

# Runner Stage
FROM base AS runner

WORKDIR /app

# Check if the group 'bun' exists; if not, create it
RUN getent group bun || addgroup --system --gid 1001 bun

# Check if the user 'hono' exists; if not, create it
RUN id -u hono &>/dev/null || adduser --system --uid 1001 hono

# Copy built application from builder
COPY --from=builder --chown=hono:bun /app/dist ./dist

# Copy package files and install production dependencies
COPY package.json bun.lockb* ./
RUN bun install --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

USER hono
EXPOSE 3000

# Run the application
CMD ["bun", "run", "dist/bun.js"]
