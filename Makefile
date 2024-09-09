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

# Run tests
test:
	$(PHPUNIT)
