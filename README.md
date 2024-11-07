<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

-   **[Vehikl](https://vehikl.com/)**
-   **[Tighten Co.](https://tighten.co)**
-   **[WebReinvent](https://webreinvent.com/)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
-   **[Cyber-Duck](https://cyber-duck.co.uk)**
-   **[DevSquad](https://devsquad.com/hire-laravel-developers)**
-   **[Jump24](https://jump24.co.uk)**
-   **[Redberry](https://redberry.international/laravel/)**
-   **[Active Logic](https://activelogic.com)**
-   **[byte5](https://byte5.de)**
-   **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Tutorial

1 Unzip the downloaded archive
2 Copy and paste soft-ui-dashboard-pro-tall-main folder in your projects folder. Rename the folder to your project's name
3 In your terminal run composer install
4 Copy .env.example to .env and updated the configurations (mainly the database configuration and email credentials, also do not forget to also change APP_URL as it is used in some of the files)
5 In your terminal run php artisan key:generate
6 Run php artisan migrate --seed to create the database tables and seed the roles and users tables
7 Run php artisan storage:link to create the storage symlink
8.php artisan serve
9.npm run dev
10.php artisan queue:listen
11.php artisan reverb:start

## Setup DB

1. Create a database in your local postgresql server
   `psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE tourism_jomla;"`
2. Run migrations
   `php artisan migrate`
3. Place csv files in seed folder
4. Change paths in seed.sql to match your local paths
5. Run seed.sql
   `psql -U postgres -h localhost -p 5432 -d tourism_jomla -f seed/seed.sql`
6. Run hashing password command
   `php artisan passwords:hash`

## Setup with Debugging (XDebug) Macos

```
# update homebrew
brew update

brew install php@8.3

# check that the path is to the correct php executable,
# and pecl is available
which pecl

# install xdebug, see https://xdebug.org/docs/install#pecl
pecl install xdebug

# check that everything worked
php --version
# should show a xdebug version
# like:  with Xdebug v2.6.0, Copyright (c) 2002-2018, by Derick Rethans
```

## Use Makefile

```
# Install PHP dependencies
make install

# Run PHP server
make serve

# Run Vite server
make dev

# Link storage
make storage_link
```

## Deployment Caveats

### post_max_size

1. php -i | grep php.ini
2. sudo nano /etc/php/8.3/cli/php.ini
3. post_max_size = 1024M
4. upload_max_filesize = 1024M
5. sudo service php8.3-fpm restart

### Sentry

```
php artisan sentry:publish --dsn=https://606ee5aaf4f4903535aa74fb16ed8ef4@o4505386622910464.ingest.us.sentry.io/4507952806821888
```

### Setup development environment

```
# Pusher (Soketi)
docker run -p 6001:6001 -d  quay.io/soketi/soketi:latest-16-alpine

#  Redis
docker run --name redis -e ALLOW_EMPTY_PASSWORD=yes -p 6379:6379 -d bitnami/redis:latest

# Postgresql
docker run \
    -v /path/to/postgresql-persistence:/bitnami/postgresql \
    bitnami/postgresql:latest

# Meilisearch
docker run -d \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.10
```

### Linux

```
apt-get install php-pgsql
```

```
php artisan migrate:fresh

php artisan db:seed --class=CompleteRawSQLSeeder

php artisan passwords:hash

php artisan superadmin:create

php artisan roles:create

php artisan db:seed --class=SettingsSeeder

php artisan db:seed --class=BirthdayTemplateSeeder

php artisan db:seed --class=AvatarTemplateSeeder

php artisan scout:import "Modules\Posts\Models\Post"
php artisan scout:import "Modules\User\Models\User"
php artisan scout:import "Modules\Communities\Models\Community"
php artisan scout:import "Modules\Crud\Models\Resource"
```

-   `http://localhost:7700` - Meilisearch
-   `http://localhost:8000/telescope` - Telescope
