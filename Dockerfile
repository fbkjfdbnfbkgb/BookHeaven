# Use official Node.js image
FROM node:18

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/. .

# Build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Move frontend build into backend (so Express can serve it)
WORKDIR /app
RUN cp -r frontend/build ./public || true

EXPOSE 3000
CMD ["npm", "start"]
