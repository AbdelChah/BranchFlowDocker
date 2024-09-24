FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache bash

# Make the wait-for-it.sh script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

EXPOSE 5000

# Use wait-for-it.sh to wait for MySQL before starting the app
CMD ["./wait-for-it.sh", "mysql:3306", "-t", "60", "--", "node", "app.js"]

