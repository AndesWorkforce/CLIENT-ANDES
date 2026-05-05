# syntax=docker/dockerfile:1.7
# ---------- Base ----------
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------- Deps ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# postinstall intenta copiar pdf worker; ya lo cubre el `|| echo skip`
RUN --mount=type=cache,id=pnpm-client,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# NEXT_PUBLIC_* se inyecta en el bundle durante `pnpm run build` (no basta el env_file en runtime).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Requiere `output: "standalone"` en next.config.ts
RUN pnpm run build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

WORKDIR /app

# Standalone output: trae sólo lo necesario
COPY --chown=nextjs:nodejs --from=build /app/public                     ./public
COPY --chown=nextjs:nodejs --from=build /app/.next/standalone           ./
COPY --chown=nextjs:nodejs --from=build /app/.next/static               ./.next/static

USER nextjs
EXPOSE 3000

# server.js lo genera Next con output:standalone
CMD ["node", "server.js"]
