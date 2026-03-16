FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build && mkdir -p /app/.mastra/output/data

EXPOSE 4111

CMD ["pnpm", "run", "start"]
