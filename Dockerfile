# Stage 1: Build the Angular app
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine

# Set working directory for Nginx static content
WORKDIR /usr/share/nginx/html

# Remove default static files (index.html, etc.)
RUN rm -rf ./*

# Copy Angular build output to Nginx html directory
COPY --from=build /app/dist/fitquol ./

# Expose port 80 and run Nginx in foreground
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
