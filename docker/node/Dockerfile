# Base Stage
FROM node:22.11.0-alpine AS base

# Builder Stage
FROM base AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build:remix:node
RUN npm run build:server:node

# Runner Stage
FROM base AS runner

WORKDIR /app

# Create group 'node' if it doesn't exist
RUN getent group node || addgroup --system --gid 1001 node

# Create user 'hono' if it doesn't exist
RUN id -u hono &>/dev/null || adduser --system --uid 1001 hono

# Copy built application from builder
COPY --from=builder --chown=hono:node /app/dist ./dist
COPY --from=builder --chown=hono:node /app/build ./build

# Copy package files and install production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

USER hono
EXPOSE 3000

# Run the application
CMD ["node", "dist/node.js"]
