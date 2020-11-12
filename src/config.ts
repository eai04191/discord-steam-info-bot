import config = require("config");

export const bot = {
    discord: {
        token: config.get("discord.token"),
    },
    itad: {
        key: config.get("itad.key"),
    },
    currency: config.get("currency"),
} as {
    discord: { token: string };
    itad: { key: string };
    currency: string;
};
