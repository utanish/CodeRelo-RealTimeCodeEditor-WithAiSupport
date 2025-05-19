# ========== Step 1: Build frontend using Vite ==========
FROM node:18-slim AS frontend

WORKDIR /app

COPY client ./client

WORKDIR /app/client
RUN npm install && npm run build


# ========== Step 2: Setup backend ==========
FROM node:18-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install compilers for code execution
RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# ✅ Copy backend dependencies
COPY ./server/package*.json ./
RUN npm install

# ✅ Copy backend source
COPY ./server/ ./    

# ✅ Copy frontend build from previous stage
COPY --from=frontend /app/client/dist ./client/dist

# Ensure temp folder exists at runtime
RUN mkdir -p /usr/src/app/temp

EXPOSE 3000

CMD ["node", "index.js"]
