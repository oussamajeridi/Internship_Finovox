# Frontend Dockerfile for development
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Set environment variables for development
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:5000

# Start development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]