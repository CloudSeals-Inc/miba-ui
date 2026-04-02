#!/bin/sh
# Generate config.js from environment variables at runtime
echo "window.MIBA_CONFIG = {" > /usr/share/nginx/html/config.js
echo "  VITE_API_URL: '${VITE_API_URL:-http://localhost:8000/api}'" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

# Now start Nginx
exec "$@"
