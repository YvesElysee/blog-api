PROJET INF222 - SYSTÈME DE GESTION DE BLOG (API REST)

1. PRÉSENTATION DU PROJET
Ce projet est une plateforme de blogging développée pour l'UE INF222 (Développement Backend) à l'Université de Yaoundé I. Il permet de manipuler des articles via une architecture REST et une base de données SQLite.

2. ARCHITECTURE TECHNIQUE
- Backend : Node.js et Express.js
- Base de données : SQLite3 (Fichier local blog_db.sqlite)
- Frontend : Interface moderne avec Tailwind CSS et Fetch API
- Middleware : CORS activé pour les communications cross-origin

3. GUIDE D'INSTALLATION LOCALE
- Installer Node.js sur votre système.
- Dans le dossier du projet, installer les dépendances : npm install express cors sqlite3
- Lancer le serveur : node server.js
- Accéder à l'interface via : http://localhost:3000

4. PROCÉDURE DE DÉPLOIEMENT SUR RENDER
Pour rendre l'API accessible en ligne, suivez ces étapes :
- Connectez-vous sur dashboard.render.com.
- Cliquez sur "New" puis "Web Service".
- Connectez votre compte GitHub et sélectionnez le dépôt "blog-api".
- Configuration du service :
  * Name : blog-api-elysee
  * Runtime : Node
  * Build Command : npm install
  * Start Command : node server.js
- Cliquez sur "Deploy Web Service". Une fois terminé, Render vous fournira une URL publique (ex: https://blog-api-elysee.onrender.com).

Note : SQLite étant un fichier local, les données ajoutées en ligne seront réinitialisées à chaque nouveau déploiement sur Render.

5. DOCUMENTATION DES ENDPOINTS
- GET /api/articles : Liste tous les articles.
- GET /api/articles/search?query=... : Recherche par mot-clé.
- POST /api/articles : Ajouter un article (JSON requis).
- DELETE /api/articles/:id : Supprimer un article (Option Corbeille).

6. CODES HTTP ET VALIDATION
- 201 : Création réussie.
- 400 : Données manquantes (Titre ou Auteur).
- 404 : Article introuvable.
- 500 : Erreur interne du serveur.

AUTEUR : Mballa Yves Elysée

