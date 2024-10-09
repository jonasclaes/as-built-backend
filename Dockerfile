# Stage 1: Build the application
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
WORKDIR /app

# Copy only the built output and package files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Set the environment variables
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD [ "npm", "run", "start:prod" ]