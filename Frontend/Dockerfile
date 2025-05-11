FROM node AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve the app using a lightweight web server
FROM nginx:alpine

# Copy the build output from the build stage to the NGINX container
COPY --from=build /app/dist /usr/share/nginx/dist

# Expose the port the app will be accessible on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

