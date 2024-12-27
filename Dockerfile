# Build stage
FROM ruby:3.2-slim as builder

# Install essential Linux packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy the rest of the site
COPY . .

# Build the site
RUN jekyll build

# Production stage
FROM caddy:2-alpine

# Copy the built static files from builder
COPY --from=builder /app/_site /usr/share/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# https://github.com/caddyserver/transform-encoder
RUN caddy add-package github.com/caddyserver/transform-encoder

# Expose port 80
EXPOSE 80

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"] 
