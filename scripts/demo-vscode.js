import { spawnSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const steps = [
  { title: "Vue d’ensemble du bot", file: "src/index.js", line: 1, note: "Montre l’initialisation et les managers du projet." },
  { title: "Les 100 commandes slash", file: "src/slash-commands.js", line: 1, note: "Fais défiler rapidement la liste centrale des commandes." },
  { title: "/kicklive", file: "src/slash-commands.js", line: 310, note: "Montre la commande de notifications Kick LIVE." },
  { title: "KickManager", file: "src/managers/KickManager.js", line: 29, note: "Montre la détection et l’envoi des notifications Kick." },
  { title: "/language", file: "src/slash-commands.js", line: 724, note: "Montre le choix de langue par serveur." },
  { title: "LanguageManager", file: "src/managers/LanguageManager.js", line: 85, note: "Montre la traduction centralisée des réponses Discord." },
  { title: "/setup-logs", file: "src/slash-commands.js", line: 711, note: "Montre la configuration automatique des logs." },
  { title: "LogManager", file: "src/managers/LogManager.js", line: 44, note: "Montre les salons, événements et Audit Log." },
  { title: "InteractionCreate", file: "src/events/interactionCreate.js", line: 200, note: "Montre le routage réel des commandes et interactions." },
  { title: "Base SQLite", file: "src/database/Database.js", line: 1, note: "Montre la persistance des configurations." },
  { title: "Déploiement des slash commands", file: "src/deploy-commands.js", line: 1, note: "Montre l’enregistrement des commandes auprès de Discord." },
  { title: "Final / Terminal", file: "package.json", line: 1, note: "Montre les scripts npm. Si tes secrets Codespaces sont configurés, lance npm start." }
];

const rl = readline.createInterface({ input, output });
console.clear();
console.log("════════════════════════════════════════════════════");
console.log("  DÉMO VS CODE RÉELLE — BOT DISCORD — 12 ÉTAPES");
console.log("════════════════════════════════════════════════════\n");
console.log("Conseil : lance d’abord l’enregistrement d’écran de ton téléphone.");
console.log("À chaque étape, le vrai fichier s’ouvre dans VS Code.\n");

for (let i = 0; i < steps.length; i++) {
  const s = steps[i];
  console.log(`\n[${i + 1}/12] ${s.title}`);
  console.log(`→ ${s.file}:${s.line}`);
  console.log(`→ ${s.note}`);
  spawnSync("code", ["-r", "-g", `${s.file}:${s.line}`], { stdio: "ignore" });
  if (i < steps.length - 1) await rl.question("Appuie sur ENTRÉE pour passer à l’étape suivante… ");
}

console.log("\n✓ Démonstration terminée.");
console.log("Pour démarrer réellement le bot : npm start");
console.log("Pour déployer les commandes : npm run deploy");
await rl.question("Appuie sur ENTRÉE pour quitter… ");
rl.close();
