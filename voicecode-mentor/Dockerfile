# Use serve to serve static files
FROM node:18-alpine

# Install serve globally
RUN npm install -g serve

WORKDIR /app

# Copy the built dist folder
COPY dist ./dist
COPY .env.production ./

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start serve on port 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
