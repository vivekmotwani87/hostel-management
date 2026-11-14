# Backend Dockerfile for Hostel Management System
FROM node:20-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose port
EXPOSE 5001

# Set production environment
ENV NODE_ENV=production

# Start backend server
CMD ["node", "server.js"]
