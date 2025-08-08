FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Cloud Run requires listening on $PORT
ENV PORT=8080
EXPOSE $PORT

# Start the application
CMD ["node", "server.js"]