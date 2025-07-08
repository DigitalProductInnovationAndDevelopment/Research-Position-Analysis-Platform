# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Stage 3: Production image
FROM node:18-slim
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./

# Copy frontend build to backend's public directory
COPY --from=frontend-build /app/frontend/build ./public

# Expose backend port (default 4000, can be overridden by PORT env var)
EXPOSE 4000

# Start backend server
CMD ["npm", "start", "--prefix", "./"] 