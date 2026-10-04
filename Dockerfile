FROM dunglas/frankenphp:php8.4-bookworm AS builder

WORKDIR /app

RUN install-php-extensions pdo_pgsql opcache zip

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN php artisan package:discover --ansi
RUN php artisan wayfinder:generate --with-form
RUN npm run build


FROM php:8.4-cli-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_pgsql opcache zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY . .

COPY --from=builder /app/bootstrap/cache ./bootstrap/cache
COPY --from=builder /app/public/build ./public/build
COPY --from=builder /app/resources/js/actions ./resources/js/actions
COPY --from=builder /app/resources/js/routes ./resources/js/routes

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

ENV LARAVEL_STORAGE_PATH=/tmp/storage
ENV VIEW_COMPILED_PATH=/tmp/storage/framework/views
ENV TMPDIR=/tmp
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "mkdir -p /tmp/storage/app/public /tmp/storage/framework/cache /tmp/storage/framework/sessions /tmp/storage/framework/views /tmp/storage/logs && php artisan serve --host=0.0.0.0 --port=${PORT}"]