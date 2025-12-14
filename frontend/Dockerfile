# ETAPA DE CONSTRUCCIÓN
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA DE PRODUCCIÓN
FROM nginx:alpine
# Copiamos la configuración de Nginx que acabas de crear
COPY nginx.conf /etc/nginx/nginx.conf
# Copiamos los archivos construidos de React (la carpeta dist)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]