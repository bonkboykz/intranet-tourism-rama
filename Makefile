# Variables
COMPOSER = php composer.phar
PHPUNIT = vendor/bin/phpunit

# Install dependencies
install:
	$(COMPOSER) install

# Run development server
serve:
	php artisan serve

dev:
	npm run dev

migrate:
	php artisan migrate

seed:
	php artisan db:seed

storage_link:
	php artisan storage:link

update_config:
	php artisan config:cache

migration:
	php artisan make:migration

model:
	php artisan make:model

start_reverb:
	php artisan reverb:start

# Run tests
test:
	$(PHPUNIT)
