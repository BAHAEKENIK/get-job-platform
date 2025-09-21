#!/usr/bin/env bash
# exit on error
set -o errexit

# Installer les dépendances
composer install --no-dev --no-interaction --prefer-dist

# Préparer Laravel pour la production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Exécuter les migrations de la base de données
php artisan migrate --force

# Créer le lien de stockage pour les fichiers publics (comme les CV)
php artisan storage:link
