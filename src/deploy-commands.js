import { REST, Routes } from "discord.js";
import { config } from "./config.js";
import { slashCommandsJson } from "./slash-commands.js";

const rest = new REST({ version: "10" }).setToken(config.token);
console.log("🔄 Déploiement global des commandes Slash...");
await rest.put(Routes.applicationCommands(config.clientId), { body: slashCommandsJson });
console.log("✅ Commandes Slash globales déployées.");
