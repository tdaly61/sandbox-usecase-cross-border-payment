# --------------------
# 🏗️ Build Stage
# --------------------
FROM node:lts-alpine3.18 AS builder

WORKDIR /app

# Install only dependencies first for better caching
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the source code
COPY . .

# Build the Vite project
RUN yarn build

# --------------------
# 🚀 Production Stage
# --------------------
FROM nginx:alpine

# Remove default static files from nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
