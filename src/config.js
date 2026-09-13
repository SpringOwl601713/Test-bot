import "dotenv/config";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token) throw new Error("DISCORD_TOKEN manque dans le fichier .env.");
if (!clientId) throw new Error("CLIENT_ID manque dans le fichier .env.");

export const config = {
    token,
    clientId,
    checkIntervalMs: Math.max(Number.parseInt(process.env.CHECK_INTERVAL_SECONDS || "30", 10) * 1000, 15_000),
    youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
    youtubeCheckIntervalMs: Math.max(Number.parseInt(process.env.YOUTUBE_CHECK_INTERVAL_SECONDS || "60", 10) * 1000, 30_000),
    twitchClientId: process.env.TWITCH_CLIENT_ID || "",
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET || "",
    twitchCheckIntervalMs: Math.max(Number.parseInt(process.env.TWITCH_CHECK_INTERVAL_SECONDS || "60", 10) * 1000, 30_000),
    kickClientId: process.env.KICK_CLIENT_ID || "",
    kickClientSecret: process.env.KICK_CLIENT_SECRET || "",
    kickCheckIntervalMs: Math.max(Number.parseInt(process.env.KICK_CHECK_INTERVAL_SECONDS || "60", 10) * 1000, 30_000)
};
