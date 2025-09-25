# Étape 1: Utiliser une image PHP 8.2 avec Apache
FROM php:8.2-apache

# Étape 2: Installer dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Étape 3: Activer Apache mod_rewrite
RUN a2enmod rewrite

# Étape 4: Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Étape 5: Copier configuration Apache
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Étape 6: Définir le répertoire de travail
WORKDIR /var/www/html

# Étape 7: Copier le code
COPY . .

# Étape 8: Installer dépendances PHP
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Étape 9: Donner permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Étape 10: Exposer le port
EXPOSE 80

# Étape 11: Démarrer Apache
CMD ["apache2-foreground"]
