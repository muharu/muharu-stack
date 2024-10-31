# Builder Stage
FROM oven/bun:1.1.33-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy application code
COPY . .

# Build the application
RUN bun run build

# Runner Stage
FROM oven/bun:1.1.33-alpine AS runner

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build

# Copy package files and install production dependencies
COPY package.json bun.lockb* ./
RUN bun install --production

# Set the environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Set the command to run the application
CMD ["bun", "run", "dist/index.js"]
