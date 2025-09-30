# Sécurité de l'API Chronaxis

## Mesures de sécurité implémentées

### 1. Authentification obligatoire
- Toutes les routes `/api/*` nécessitent une authentification JWT
- Exceptions : login, contact public, et consultation publique des emplois du temps

### 2. Rate Limiting
- **Login** : 5 tentatives par 15 minutes par IP
- **Contact** : 3 messages par heure par IP  
- **API générale** : 100 requêtes par 15 minutes par IP

### 3. En-têtes de sécurité (Helmet)
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 4. Validation des données
- Sanitisation contre les injections NoSQL
- Protection XSS
- Limitation de la taille des requêtes (10MB)

### 5. Logging de sécurité
- Enregistrement des tentatives d'accès non autorisées
- Tracking des IP et User-Agent suspects

### 6. CORS sécurisé
- Configuration CORS appropriée
- Gestion des requêtes preflight

## Routes publiques (sans authentification)
- `POST /api/auth/login` - Connexion
- `POST /api/contact` - Formulaire de contact
- `GET /api/departments` - Liste des départements
- `GET /api/academic-years` - Années universitaires
- `GET /api/classes` - Classes (pour espace étudiant)
- `GET /api/sessions` - Séances (pour espace étudiant)

## Routes protégées
Toutes les autres routes nécessitent un token JWT valide dans l'en-tête Authorization.

## Variables d'environnement requises
- `JWT_SECRET` - Clé secrète pour les tokens JWT
- `MONGO_URI` - URI de connexion MongoDB
- `NODE_ENV` - Environnement (production/development)