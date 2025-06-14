import "dotenv/config";
import client from "./bot";
import { Events, REST, Routes, WebhookClient } from "discord.js";
import { commands } from "./bot/commands";
import { startPositionManager } from "./utils/position_manager";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.BOT_CLIENT_ID!;
const discordChannelWebhook = process.env.DISCORD_CHANNEL_WEBHOOK!;

if (!token) {
  throw new Error("DISCORD_TOKEN is not set");
}

if (!clientId) {
  throw new Error("CLIENT_ID is not set");
}

if (!discordChannelWebhook) {
  throw new Error("DISCORD_CHANNEL_WEBHOOK is not set");
}

export const webhookClient = new WebhookClient({ url: discordChannelWebhook });

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log("Started refreshing application commands.");
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands.map((command) => command.data.toJSON()),
    });
    console.log(data);
    console.log(`Successfully registered ${commands.size} commands`);

    startPositionManager();
  } catch (error) {
    console.error(error);
  }
})();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
