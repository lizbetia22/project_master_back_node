FROM node:16

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3333

CMD ["npm", "run", "start"]
