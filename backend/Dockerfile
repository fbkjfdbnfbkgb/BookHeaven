# Use official Node.js image
FROM node:18

WORKDIR /app

# Copy backend package.json
COPY backend/package*.json ./

RUN npm install

# Copy backend source code
COPY backend/. .

EXPOSE 3000

CMD ["npm", "start"]
