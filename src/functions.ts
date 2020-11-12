import { Message } from "discord.js";

export const isSteamStoreURL = (message: Message) => {
    const regex = /^https:\/\/store\.steampowered\.com\/app\/\d+/;
    return regex.test(message.content);
};
