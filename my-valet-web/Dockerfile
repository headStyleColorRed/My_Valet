FROM ubuntu

# Update and install nginx
RUN apt-get update 
RUN apt-get install nginx -y 

# Copy build folder
RUN rm -rf /var/www/html/index.nginx-debian.html
COPY dist/ /var/www/html/

# Copy configuration folder
RUN rm -rf /etc/nginx/sites-available/default
COPY Docker/default /etc/nginx/sites-available

# Execute
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
EXPOSE 443