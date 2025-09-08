# Scripts de nettoyage de la base de données

## Description

Ces scripts permettent de nettoyer les séances orphelines dans la base de données, c'est-à-dire les séances qui :
- N'ont pas de classe assignée (class = null ou undefined)
- Référencent une classe qui n'existe plus dans la base de données

## Scripts disponibles

### 1. `cleanOrphanSessions.js` - Nettoyage interactif
- Analyse la base de données
- Affiche les séances orphelines trouvées
- Demande confirmation avant suppression
- **Recommandé pour la première utilisation**

### 2. `cleanOrphanSessions-auto.js` - Nettoyage automatique
- Supprime automatiquement toutes les séances orphelines
- Aucune confirmation demandée
- **Attention : Suppression immédiate**

### 3. `clean-db.bat` - Interface utilisateur
- Menu interactif pour choisir le type de nettoyage
- Lance le script approprié

## Utilisation

### Option 1 : Script batch (Windows)
```bash
cd backend
clean-db.bat
```

### Option 2 : Commande directe
```bash
cd backend

# Nettoyage interactif
node scripts/cleanOrphanSessions.js

# Nettoyage automatique
node scripts/cleanOrphanSessions-auto.js
```

## Que font ces scripts ?

1. **Connexion** à la base de données MongoDB
2. **Analyse** de toutes les séances existantes
3. **Identification** des séances orphelines :
   - Séances sans classe (class = null)
   - Séances avec une classe qui n'existe plus
4. **Suppression** des séances orphelines
5. **Rapport** du nombre de séances supprimées

## Sécurité

- ✅ **Sauvegarde recommandée** avant utilisation
- ✅ **Mode interactif** disponible pour vérification
- ✅ **Logs détaillés** de toutes les opérations
- ✅ **Connexion automatiquement fermée** après exécution

## Exemple de sortie

```
✅ Connexion à MongoDB établie
📊 45 séances trouvées
❌ Séance orpheline trouvée: 507f1f77bcf86cd799439011 (classe 507f191e810c19729de860ea n'existe plus)
❌ Séance orpheline trouvée: 507f1f77bcf86cd799439012 (pas de classe)

⚠️  2 séances orphelines détectées
Voulez-vous les supprimer ? (Tapez "oui" pour confirmer)
Confirmation: oui
✅ 2 séances orphelines supprimées
🔌 Connexion fermée
```

## Quand utiliser ces scripts ?

- Après suppression de classes
- Maintenance périodique de la base de données
- Résolution de problèmes d'intégrité des données
- Avant migration ou sauvegarde importante