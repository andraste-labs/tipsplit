# ============================================================
# TipSplit - Static Site Container (no build, no backend)
# Multi-stage build: validation stage + minimal nginx runtime
# ============================================================

# ---------- Stage 1: Validate static assets ----------
FROM alpine:3.19 AS assets
WORKDIR /assets
COPY frontend/ .
# TipSplit has NO build step - this stage only verifies the required
# static files exist before they are copied into the runtime image.
RUN test -f index.html && test -f styles.css && test -f app.js && \
    echo "Static assets verified: index.html, styles.css, app.js"

# ---------- Stage 2: Production static server ----------
FROM nginx:1.25-alpine AS production
LABEL org.opencontainers.image.title="tipsplit-static" \
      org.opencontainers.image.description="TipSplit - static HTML/CSS/JS app, no build, no backend" \
      org.opencontainers.image.source="https://github.com/your-org/tipsplit"

# Create non-root user
RUN addgroup -g 1001 -S webgroup && adduser -S webuser -u 1001 -G webgroup

# Copy verified static assets from the assets stage
COPY --from=assets /assets /usr/share/nginx/html

# Minimal, hardened nginx config with a health endpoint
RUN printf 'server {\n\
    listen 8080;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    server_tokens off;\n\
    location /health {\n\
        return 200 "OK";\n\
        add_header Content-Type text/plain;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ =404;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Fix permissions for non-root nginx process
RUN chown -R webuser:webgroup /usr/share/nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
 && touch /var/run/nginx.pid \
 && chown webuser:webgroup /var/run/nginx.pid

USER webuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
