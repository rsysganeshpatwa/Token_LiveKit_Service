# Use an official Node.js runtime as a parent image
FROM node:19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install AWS CLI
RUN apt-get update && apt-get install -y python3-pip && pip3 install awscli && apt-get clean

# Copy the rest of your app's source code
COPY . .

# Expose the app on port 3000 (or whichever port your app uses)
EXPOSE 3000

# Start the app after syncing S3
CMD ["npm", "start"]
