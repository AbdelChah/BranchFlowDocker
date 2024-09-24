# Use a node image to build the frontend
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Expose port 5173 for the Vite development server
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
