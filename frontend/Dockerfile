# Base image
FROM node:alpine AS node-builder

# Working directory
WORKDIR /app

# Copy frontend package
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of frontend
COPY . .

#Environment Variables
ENV PUBLIC_API_URL="http://16.176.199.82:3000/"

# Build app
RUN npm run build

# Run from Nginx
FROM nginx:alpine
COPY --from=node-builder /app/dist /usr/share/nginx/html