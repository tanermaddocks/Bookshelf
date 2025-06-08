# Base image
FROM node:alpine

# Working directory
WORKDIR /app

# Copy backend package
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of backend
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]

