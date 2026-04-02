#!/bin/sh
# Generate config.js from environment variables at runtime
# Only inject VITE_API_URL if explicitly set - avoids overriding the build-time value with localhost
echo "window.MIBA_CONFIG = {" > /usr/share/nginx/html/config.js
if [ -n "$VITE_API_URL" ]; then
  echo "  VITE_API_URL: '${VITE_API_URL}'" >> /usr/share/nginx/html/config.js
fi
echo "};" >> /usr/share/nginx/html/config.js

# Delegate to the official nginx entrypoint so nginx.conf.template gets processed
# (substitutes ${PORT} -> 8080 before nginx starts)
exec /docker-entrypoint.sh "$@"
