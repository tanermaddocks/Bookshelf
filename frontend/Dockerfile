# Base image
FROM node:alpine

# Working directory
WORKDIR /app

# Copy frontend package
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy rest of frontend
COPY . .

# Build app
RUN npm run build

# Environment variables
ENV NODE_ENV=production
ENV PORT=3600
ENV PUBLIC_API_URL="http://localhost:3200"

# Expose port
EXPOSE 3600

# Run app
CMD ["node", "./dist/server/entry.mjs"]