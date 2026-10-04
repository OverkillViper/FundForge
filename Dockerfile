FROM node:22-bookworm-slim AS node

FROM dunglas/frankenphp:php8.4-bookworm AS builder

WORKDIR /app

RUN install-php-extensions pdo_pgsql opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

ENV PATH="/usr/local/lib/node_modules/npm/bin:$PATH"

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN php artisan wayfinder:generate --with-form
RUN npm run build


FROM dunglas/frankenphp:php8.4-bookworm

WORKDIR /app

RUN install-php-extensions pdo_pgsql opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY . .

COPY --from=builder /app/public/build ./public/build
COPY --from=builder /app/resources/js/actions ./resources/js/actions
COPY --from=builder /app/resources/js/routes ./resources/js/routes

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN mkdir -p /data/storage/app/public /data/storage/framework/cache /data/storage/framework/sessions /data/storage/framework/views /data/storage/logs

COPY Caddyfile /etc/frankenphp/Caddyfile

ENV LARAVEL_STORAGE_PATH=/data/storage
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8080

EXPOSE 8080

CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]