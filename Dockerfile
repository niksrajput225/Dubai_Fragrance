
FROM nginx:1.27-alpine

LABEL maintainer="Dubai Fragrances Team"
LABEL description="Artisanal Arabian Attars E-Commerce Web Application"

# Remove default Nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website static assets to Nginx webroot
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Set proper read permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check instruction
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
