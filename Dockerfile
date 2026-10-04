FROM node:22-bookworm AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    php8.4-cli \
    php8.4-pgsql \
    php8.4-zip \
    php8.4-mbstring \
    php8.4-xml \
    php8.4-curl \
    php8.4-bcmath \
    php8.4-intl \
    unzip \
    curl \
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
    libpq5 \
    libzip4 \
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

RUN mkdir -p \
    /data/storage/app/public \
    /data/storage/framework/cache \
    /data/storage/framework/sessions \
    /data/storage/framework/views \
    /data/storage/logs

ENV LARAVEL_STORAGE_PATH=/data/storage
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]