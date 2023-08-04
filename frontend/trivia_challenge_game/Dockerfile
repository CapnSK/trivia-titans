# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /trivia_challenge_game

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application source code to the container
COPY . .

# Expose port
EXPOSE 3000

# Build the application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Set the command to run when the container starts
CMD ["serve", "-s", "build"]