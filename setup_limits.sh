#!/bin/bash

PHP_INI_PATH=$(php -i | grep '/php.ini' | awk '{print $6}')

echo "PHP_INI_PATH: $PHP_INI_PATH"

# Set file upload limits in php.ini
echo "\nupload_max_filesize = 20M" >> $PHP_INI_PATH
echo "\npost_max_size = 20M" >> $PHP_INI_PATH

# echo "\nzend.exception_ignore_args = Off" >> $PHP_INI_PATH
