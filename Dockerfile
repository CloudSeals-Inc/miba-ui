# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_APP_VERSION
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Use the template to handle the PORT environment variable
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
