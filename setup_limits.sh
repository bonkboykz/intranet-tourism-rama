#!/bin/bash

# Set buffer limits in FastCGI
echo "fastcgi_buffers 16 16k;" >> /etc/nginx/nginx.conf
echo "fastcgi_buffer_size 32k;" >> /etc/nginx/nginx.conf

# Set file upload limits in php.ini
echo "upload_max_filesize = 20M" >> /etc/php/php.ini
echo "post_max_size = 20M" >> /etc/php/php.ini
