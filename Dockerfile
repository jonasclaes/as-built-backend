# Stage 1: building the application

# Build the application
FROM node:20-slim as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# Build application
RUN npm run build

# Stage 2: Run the application
FROM node:20-slim as production

# Set working directory
WORKDIR /src/app

# Copy only the build output and package files from build stage
COPY --from=build /src/app/dist ./dist
COPY --from=build /src/app/package*.json ./

#Install production dependencies
RUN npm install --only=production

# Set the environment variables
ENV NODE_ENV=production

#Set the environment variables
EXPOSE 3000

# Command to run the app
CMD [ "npm", "run", "start:prod" ]