# Dockerfile for Bang Yai Child Development Center MIS
FROM nginx:alpine

# Copy web app static files to Nginx web root
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
