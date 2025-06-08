# Base image
FROM node:alpine

# Working directory
WORKDIR /app

# Copy frontend package
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of frontend
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3600

# Expose port
EXPOSE 3600

# Build app
CMD ["npm", "run", "build"]