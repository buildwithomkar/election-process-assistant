# Use a stable Nginx image
FROM nginx:stable-alpine

# Copy all files to the web server root
COPY . /usr/share/nginx/html

# Create a custom Nginx configuration to listen on port 8080 (Cloud Run requirement)
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
