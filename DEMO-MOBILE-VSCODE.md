# Démo réelle du bot dans Visual Studio Code depuis un téléphone

Cette version est préparée pour **GitHub Codespaces**, qui ouvre un vrai environnement Visual Studio Code dans le navigateur avec Node.js et un terminal.

## Important — secrets

Le fichier `.env` d’origine n’est pas inclus afin d’éviter de publier ton token Discord ou tes clés API sur GitHub.

Utilise `.env.example` pour connaître les variables nécessaires. Si tu veux réellement démarrer le bot dans Codespaces, ajoute les valeurs comme **Codespaces Secrets** ou recrée un `.env` privé directement dans Codespaces. Ne montre jamais ces valeurs pendant la vidéo.

## Depuis iPhone / Android

1. Ouvre ce dépôt GitHub dans ton navigateur.
2. Choisis **Code → Codespaces → Create codespace**.
3. Attends l’installation automatique de Node.js 22 et des dépendances npm.
4. Passe ton téléphone en paysage.
5. Lance l’enregistrement d’écran.
6. Dans le terminal VS Code, lance `npm run demo`.

Le script ouvre successivement 12 vrais fichiers du projet dans VS Code. Appuie sur Entrée dans le terminal pour passer à l’étape suivante.

## Démarrage réel du bot

Uniquement lorsque les secrets privés sont configurés : `npm start`

Déploiement des commandes slash : `npm run deploy`

> Ne filme jamais `.env`, les Codespaces Secrets, le token Discord ou les clés API.
