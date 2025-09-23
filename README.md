# 🏥 Doctolib Clone - Application de Gestion Médicale

Une application web moderne de gestion médicale développée avec Angular 19, simulant la plateforme Doctolib avec des fonctionnalités complètes de gestion des rendez-vous, des médecins et des patients.

## 🌐 Démo en Ligne

**Application hébergée sur Vercel :** [Voir la démo](https://final-project-angular-theta.vercel.app/)

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisation
- **Connexion/Déconnexion** avec gestion des sessions
- **Inscription** avec validation des données
- **3 Rôles utilisateur** : Patient, Médecin, Administrateur
- **Guards de protection** des routes sensibles

### 👨‍⚕️ Interface Médecin
- **Dashboard** avec statistiques personnalisées
- **Gestion des rendez-vous** (confirmer, terminer, annuler)
- **Planning hebdomadaire** avec vue calendrier
- **Gestion des patients** avec historique complet
- **Profil médecin** modifiable

### 🏥 Interface Patient
- **Recherche de médecins** par spécialité, localisation, tarif
- **Prise de rendez-vous** en ligne
- **Gestion des RDV** (voir, annuler)
- **Historique médical** complet
- **Profil patient** modifiable

### ⚙️ Interface Administrateur
- **Dashboard** avec statistiques globales
- **Gestion des médecins** (créer, modifier, activer/désactiver)
- **Gestion des patients** (voir, activer/désactiver)
- **Vue d'ensemble** de la plateforme

## 🛠️ Technologies Utilisées

### Frontend
- **Angular 19** - Framework principal
- **TypeScript** - Langage de programmation
- **Tailwind CSS** - Framework CSS
- **Angular Signals** - Gestion d'état réactive
- **Angular Router** - Navigation et routing
- **Angular Forms** - Gestion des formulaires

### Outils de Développement
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **Husky** - Git hooks
- **Angular CLI** - Outils de développement

### Architecture
- **Domain-Driven Design (DDD)** - Architecture modulaire
- **Standalone Components** - Composants autonomes
- **Dependency Injection** - Injection de dépendances
- **localStorage** - Persistance des données

## 📁 Structure du Projet

```
src/
├── app/
│   ├── core/                    # Services et guards centraux
│   │   ├── guards/             # Guards d'authentification
│   │   └── services/           # Services globaux
│   ├── features/               # Modules fonctionnels
│   │   ├── auth/               # Authentification
│   │   ├── doctors/            # Gestion des médecins
│   │   ├── patients/           # Gestion des patients
│   │   ├── appointments/       # Gestion des rendez-vous
│   │   ├── admin/              # Interface administrateur
│   │   └── dashboard/          # Tableaux de bord
│   ├── shared/                 # Composants partagés
│   │   ├── components/         # Composants réutilisables
│   │   └── services/           # Services partagés
│   └── infrastructure/         # Configuration et utilitaires
├── environments/               # Variables d'environnement
└── assets/                     # Ressources statiques
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI

### Installation
```bash
# Cloner le repository
cd final-project-angular

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# L'application sera accessible sur http://localhost:4200
```

### Build de Production
```bash
# Build pour la production
ng build --configuration production

# Les fichiers seront générés dans le dossier dist/
```

## 👥 Comptes de Test

### Administrateur
- **Email :** admin@doctolib.com
- **Mot de passe :** admin123

### Médecin
- **Email :** dr.martin@doctolib.com
- **Mot de passe :** doctor123

### Patient
- **Email :** patient@doctolib.com
- **Mot de passe :** patient123

## 🔧 Configuration

### Variables d'Environnement
Le projet utilise des variables d'environnement pour la configuration :

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  appName: 'final-project-angular'
};
```

### localStorage
L'application utilise localStorage pour la persistance des données :
- `doctolib_users` - Utilisateurs enregistrés
- `doctolib_doctors` - Profils des médecins
- `doctolib_appointments` - Rendez-vous
- `doctolib_currentUser` - Utilisateur connecté

## 🎨 Design et UX

### Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Responsive** pour mobile, tablette et desktop
- **Navigation intuitive** avec breadcrumbs
- **Feedback visuel** pour toutes les actions
- **Modales** pour les interactions complexes

### Accessibilité
- **Navigation clavier** complète
- **Contraste** respecté
- **Labels** appropriés
- **Focus** visible

## 🧪 Tests

### Tests Unitaires
```bash
# Lancer les tests unitaires
ng test

# Tests avec couverture
ng test --code-coverage
```

### Tests E2E
```bash
# Lancer les tests end-to-end
ng e2e
```

## 📱 Fonctionnalités Avancées

### Gestion des Rendez-vous
- **Statuts multiples** : Programmé, Confirmé, Terminé, Annulé
- **Automatisation** : Les RDV passés sont automatiquement marqués comme terminés
- **Filtrage** par date, statut, médecin
- **Validation** des créneaux disponibles

### Recherche Intelligente
- **Filtres multiples** : Spécialité, localisation, tarif, note
- **Recherche en temps réel**
- **Tri** par pertinence, note, tarif

### Notifications
- **Confirmations** d'actions
- **Alertes** d'erreur
- **Messages** de succès

## 🔒 Sécurité

### Authentification
- **Validation** côté client
- **Sessions** sécurisées avec localStorage
- **Protection** des routes sensibles

### Données
- **Validation** des entrées utilisateur
- **Sanitisation** des données
- **Persistance** locale sécurisée

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Déploiement automatique avec Git
# Connecter votre repository GitHub à Vercel
```

### Autres Plateformes
- **Netlify** : `ng build && netlify deploy`
- **Firebase** : `ng build && firebase deploy`
- **AWS S3** : `ng build && aws s3 sync dist/ s3://bucket-name`

## 🤝 Contribution

### Guidelines
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **ESLint** pour le linting
- **Prettier** pour le formatage
- **Conventional Commits** pour les messages
- **Tests** obligatoires pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- LinkedIn: [Votre Profil](https://linkedin.com/in/votre-profil)
- Email: votre.email@example.com

## 🙏 Remerciements

- **Angular Team** pour le framework exceptionnel
- **Tailwind CSS** pour les styles magnifiques
- **Vercel** pour l'hébergement gratuit
- **Communauté open source** pour l'inspiration

## 📞 Support

Pour toute question ou problème :
- **Issues GitHub** : [Ouvrir une issue](https://github.com/votre-username/doctolib-clone/issues)
- **Email** : support@example.com
- **Discord** : [Rejoindre le serveur](https://discord.gg/votre-serveur)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé !**
