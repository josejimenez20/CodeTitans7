# BUILD STAGE
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PRODUCTION STAGE
FROM node:20-alpine
WORKDIR /app

# Crear usuario seguro (no root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Asignar permisos
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]