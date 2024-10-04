FROM ghcr.io/railwayapp/nixpacks:ubuntu-1725321821

ENTRYPOINT ["/bin/bash", "-l", "-c"]
WORKDIR /app/


COPY .nixpacks/nixpkgs-5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.nix .nixpacks/nixpkgs-5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.nix
RUN nix-env -if .nixpacks/nixpkgs-5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.nix && nix-collect-garbage -d

COPY .nixpacks/assets /assets/
ARG IS_LARAVEL MEMORY_LIMIT NIXPACKS_METADATA NIXPACKS_PHP_ROOT_DIR PORT POST_MAX_SIZE UPLOAD_MAX_FILESIZE
ENV IS_LARAVEL=$IS_LARAVEL MEMORY_LIMIT=$MEMORY_LIMIT NIXPACKS_METADATA=$NIXPACKS_METADATA NIXPACKS_PHP_ROOT_DIR=$NIXPACKS_PHP_ROOT_DIR PORT=$PORT POST_MAX_SIZE=$POST_MAX_SIZE UPLOAD_MAX_FILESIZE=$UPLOAD_MAX_FILESIZE

# php:setup phase
# noop

# setup phase
COPY . /app/.
RUN  UPLOAD_INI_PATH=$(find /nix/store/*-php-*/lib -name php.ini -print0 | head -z -n 1 | rev | cut -c 9- | rev)/upload.ini; echo "upload_max_filesize=${UPLOAD_MAX_FILESIZE};" >> $UPLOAD_INI_PATH; echo "post_max_size=${POST_MAX_SIZE};" >> $UPLOAD_INI_PATH; echo "memory_limit=${MEMORY_LIMIT};" >> $UPLOAD_INI_PATH;

# install phase
COPY . /app/.
RUN  mkdir -p /var/log/nginx && mkdir -p /var/cache/nginx
RUN  composer install --ignore-platform-reqs
RUN  npm ci

# php:install phase
COPY . /app/.
RUN  mkdir -p /var/log/nginx && mkdir -p /var/cache/nginx
RUN  composer install --ignore-platform-reqs
RUN  npm ci

# build phase
COPY . /app/.
RUN  npm run build
RUN  php artisan storage:link

# php:build phase
COPY . /app/.
RUN  npm run build








# start
COPY . /app
CMD ["node /assets/scripts/prestart.mjs /app/nginx.template.conf /nginx.conf && (php-fpm -y /assets/php-fpm.conf & nginx -c /nginx.conf)"]

