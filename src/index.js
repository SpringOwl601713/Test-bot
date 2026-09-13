import {
    Client,
    Events,
    GatewayIntentBits
} from "discord.js";
import { config } from "./config.js";
import { handleInteraction } from "./events/interactionCreate.js";
import { LiveManager } from "./managers/LiveManager.js";
import { SecurityManager } from "./managers/SecurityManager.js";
import { AntiPiracyManager } from "./managers/AntiPiracyManager.js";
import { InviteLoggerManager } from "./managers/InviteLoggerManager.js";
import { InviteStatsManager } from "./managers/InviteStatsManager.js";
import { BoostManager } from "./managers/BoostManager.js";
import { EffectifManager } from "./managers/EffectifManager.js";
import { TicketManager } from "./managers/TicketManager.js";
import { CounterManager } from "./managers/CounterManager.js";
import { LegacyCommandsManager } from "./managers/LegacyCommandsManager.js";
import { YouTubeManager } from "./managers/YouTubeManager.js";
import { GiveawayManager } from "./managers/GiveawayManager.js";
import { RecoveryManager } from "./managers/RecoveryManager.js";
import { TwitchManager } from "./managers/TwitchManager.js";
import { KickManager } from "./managers/KickManager.js";
import { slashCommandsJson } from "./slash-commands.js";
import { installAntiCrash } from "./utils/anticrash.js";
import { installAutorank } from "./managers/AutorankManager.js";
import { BackupManager } from "./managers/BackupManager.js";
import { LogManager } from "./managers/LogManager.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

installAntiCrash(client);
installAutorank(client);

const liveManager = new LiveManager(client, config.checkIntervalMs);
const securityManager = new SecurityManager(client);
const antiPiracyManager = new AntiPiracyManager(client);
const inviteLoggerManager = new InviteLoggerManager(client);
const inviteStatsManager = new InviteStatsManager(client);
const boostManager = new BoostManager(client);
const effectifManager = new EffectifManager(client);
const ticketManager = new TicketManager(client);
const counterManager = new CounterManager(client);
const legacyCommandsManager = new LegacyCommandsManager(client);
const giveawayManager = new GiveawayManager(client);
const recoveryManager = new RecoveryManager(client);
const backupManager = new BackupManager(client);
const logManager = new LogManager(client);
logManager.start();

const youtubeManager = new YouTubeManager(client, { apiKey: config.youtubeApiKey, intervalMs: config.youtubeCheckIntervalMs });
const twitchManager = new TwitchManager(client, { clientId: config.twitchClientId, clientSecret: config.twitchClientSecret, intervalMs: config.twitchCheckIntervalMs });
const kickManager = new KickManager(client, { clientId: config.kickClientId, clientSecret: config.kickClientSecret, intervalMs: config.kickCheckIntervalMs });

client.once(Events.ClientReady, async readyClient => {
    console.log(`✅ ${readyClient.user.tag} est connecté.`);
    console.log(`✅ ${readyClient.guilds.cache.size} serveur(s).`);
    try {
        console.log("🔄 Synchronisation automatique des commandes Slash...");
        await readyClient.application.commands.set(slashCommandsJson);
        console.log(`✅ ${slashCommandsJson.length} commande(s) Slash synchronisée(s).`);
    } catch (error) {
        console.error("❌ Impossible de synchroniser les commandes Slash :", error);
    }
    await liveManager.start();
    await twitchManager.start();
    await kickManager.start();
    await youtubeManager.start();
    await inviteLoggerManager.start();
    await inviteStatsManager.start();
    await counterManager.start();
    await legacyCommandsManager.start();
    await giveawayManager.start();
});

client.on(Events.InteractionCreate, interaction => {
    handleInteraction(interaction, liveManager, securityManager, twitchManager, kickManager, youtubeManager, antiPiracyManager, inviteLoggerManager, inviteStatsManager, boostManager, effectifManager, ticketManager, counterManager, legacyCommandsManager, giveawayManager, recoveryManager, backupManager, logManager).catch(error => console.error("❌ Erreur d'interaction :", error));
});

client.on(Events.MessageCreate, message => {
    legacyCommandsManager.onMessageCreate(message).catch(error => console.error("❌ Erreur commandes importées :", error));
    antiPiracyManager.handleMessage(message).catch(error => console.error("❌ Erreur anti-piratage :", error));
});

client.on(Events.GuildMemberAdd, member => {
    recoveryManager.handleMemberJoin(member).catch(error => console.error("❌ Erreur récupération retour :", error));
    counterManager.schedule(member.guild);
    legacyCommandsManager.onMemberAdd(member).catch(error => console.error("❌ Erreur anti-bot importé :", error));
    securityManager.handleMemberJoin(member).catch(error => console.error("❌ Erreur anti-raid :", error));
    inviteLoggerManager.handleMemberJoin(member).catch(error => console.error("❌ Erreur InviteLogger arrivée :", error));
    inviteStatsManager.handleMemberJoin(member).catch(error => console.error("❌ Erreur compteur invitations arrivée :", error));
});

client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    counterManager.schedule(newMember.guild);
    effectifManager.handleMemberUpdate(oldMember, newMember).catch(error => console.error("❌ Erreur effectif :", error));
    boostManager.handleMemberUpdate(oldMember, newMember).catch(error => console.error("❌ Erreur notification boost :", error));
});

client.on(Events.GuildMemberRemove, member => {
    recoveryManager.handleMemberLeave(member).catch(error => console.error("❌ Erreur sauvegarde récupération :", error));
    counterManager.schedule(member.guild);
    inviteLoggerManager.handleMemberLeave(member).catch(error => console.error("❌ Erreur InviteLogger départ :", error));
    inviteStatsManager.handleMemberLeave(member).catch(error => console.error("❌ Erreur compteur invitations départ :", error));
});

client.on(Events.PresenceUpdate, (oldPresence, newPresence) => {
    const guild = newPresence?.guild || oldPresence?.guild;
    if (guild) counterManager.schedule(guild);
});
client.on(Events.InviteCreate, invite => { inviteLoggerManager.handleInviteChange(invite.guild).catch(() => {}); inviteStatsManager.handleInviteChange(invite.guild).catch(() => {}); });
client.on(Events.InviteDelete, invite => { inviteLoggerManager.handleInviteChange(invite.guild).catch(() => {}); inviteStatsManager.handleInviteChange(invite.guild).catch(() => {}); });
client.on(Events.MessageDelete, message => legacyCommandsManager.onMessageDelete(message));
client.on(Events.VoiceStateUpdate, (oldState, newState) => legacyCommandsManager.onVoiceStateUpdate(oldState, newState).catch(error => console.error("❌ Erreur vocaux temporaires :", error)));
client.on(Events.Error, error => console.error("❌ Erreur Discord :", error));
process.on("unhandledRejection", error => console.error("❌ Promesse non gérée :", error));
process.on("uncaughtException", error => console.error("❌ Erreur non interceptée :", error));

client.login(config.token);
