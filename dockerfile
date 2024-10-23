# Use an official Node.js runtime as a parent image
FROM node:19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the app on port 3000 (or whichever port your app uses)
EXPOSE 3000

# Start your Node.js app
CMD ["npm", "start"]
