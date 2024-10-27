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

start_notifications:
	php artisan queue:work

queue_listen:
	php artisan queue:listen

seed_settings:
	php artisan db:seed --class=SettingsSeeder

seed_birthday_templates:
	php artisan db:seed --class=BirthdayTemplateSeeder

seed_avatar_template:
	php artisan db:seed --class=AvatarTemplateSeeder

seed_offiria:
	php artisan db:seed --class=CompleteRawSQLSeeder

# Run tests
test:
	$(PHPUNIT)
