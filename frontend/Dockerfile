FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run in development mode for easier debugging
CMD ["npm", "run", "dev"]
