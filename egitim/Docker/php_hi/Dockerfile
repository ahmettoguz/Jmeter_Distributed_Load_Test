#Dockerfile
FROM  php:8.0-apache

# target files and destination file | relative ve absolute path
COPY . /var/www/html/

# porttan dinlemek için
EXPOSE 80

# container de run etmek için container run edildiği zaman yapar
CMD ["apache2-foreground"]