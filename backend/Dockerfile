# Étape 1: Utiliser une image de base officielle pour PHP 8.2 avec Apache
FROM php:8.2-apache

# Étape 2: Mise à jour des paquets et installation des dépendances système
# - libzip-dev pour le support des archives zip
# - libpng-dev, libjpeg-dev, libfreetype6-dev pour le traitement d'images (GD)
# - git et unzip pour Composer
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Étape 3: Installation des extensions PHP nécessaires à Laravel
# - pdo & pdo_mysql pour la connexion à la base de données
# - gd pour la manipulation d'images
# - zip pour la gestion des archives
RUN docker-php-ext-install pdo pdo_mysql gd zip

# Étape 4: Activer le module de réécriture d'URL d'Apache
RUN a2enmod rewrite

# Étape 5: Installation de Composer (le gestionnaire de paquets de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Étape 6: Configuration d'Apache pour qu'il pointe vers le dossier `public` de Laravel
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Étape 7: Définir le répertoire de travail
WORKDIR /var/www/html

# Étape 8: Copier tous les fichiers du projet Laravel dans l'image
COPY . .

# Étape 9: Installer les dépendances PHP du projet
# --no-dev : pour ignorer les paquets de développement, plus léger
# --optimize-autoloader : pour des performances optimales
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Étape 10: Définir les bonnes permissions pour les dossiers de cache et de stockage
RUN chown -R www-data:www-data storage bootstrap/cache

# Étape 11: Exposer le port sur lequel Apache écoute
EXPOSE 80

# Étape 12: La commande qui sera exécutée pour démarrer le serveur
CMD ["apache2-foreground"]
