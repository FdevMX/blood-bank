FROM node:24-bookworm AS base

# 1. Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Reconstruir el código fuente
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 3. Imagen de producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copiar dependencias de producción generadas en la etapa de build
COPY --from=builder /app/node_modules ./node_modules
# Copiar package.json (útil para algunas plataformas y para referencia)
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]