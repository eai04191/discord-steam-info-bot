import { Client, MessageEmbed } from "discord.js";
import * as dayjs from "dayjs";
import "dayjs/locale/ja";
import * as relativeTime from "dayjs/plugin/relativeTime";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import { bot } from "./config";
import { isSteamStoreURL } from "./functions";
import {
    getPlainGameName,
    getLowestPriceInSteam,
    steamAppdetails,
} from "./api";
import { log } from "./log";

dayjs.locale("ja");
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const client = new Client();

client.on("ready", () => {
    log.info("Bot ready");
});

client.on("message", async (message) => {
    if (!isSteamStoreURL(message)) return;

    log.debug(`Received message: ${message.content}`);

    await message.suppressEmbeds(true);
    log.debug(`Suppressed Embed`);

    const responseMessage = await message.channel.send(
        null,
        new MessageEmbed().setDescription("データを取得しています……")
    );

    const { plain, appid } = await getPlainGameName(message.content);
    responseMessage.edit(
        null,
        new MessageEmbed().setDescription(
            `${plain}の価格情報を取得しています……`
        )
    );

    try {
        const [steamInfo, gameInfo] = await Promise.all([
            steamAppdetails(appid),
            getLowestPriceInSteam(plain),
        ]);

        responseMessage.edit(
            null,
            new MessageEmbed()
                .setTitle(steamInfo.name)
                .setURL(`https://store.steampowered.com/app/${appid}/`)
                .setThumbnail(
                    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`
                )
                .addField(
                    "現在のSteam価格",
                    steamInfo.price_overview?.final_formatted || "無料",
                    true
                )
                .addField(
                    "Steam最安値",
                    `**${gameInfo.price} USD**\n` +
                        `${dayjs(gameInfo.added).format("LT")}\n` +
                        `(**${gameInfo.cut}%** OFF, ` +
                        `${dayjs(gameInfo.added).fromNow()}) `,
                    true
                )
                .addField(
                    "Links",
                    `<:IsThereAnyDeal:776416009912975380> [IsThereAnyDeal](${gameInfo.urls.game})　<:steamdb:776370192607215637> [SteamDB](https://steamdb.info/app/${appid}/)`
                )
                .setColor("DARK_BUT_NOT_BLACK")
                .setFooter(
                    "Powered by IsThereAnyDeal.com API",
                    "https://d2uym1p5obf9p8.cloudfront.net/images/favicon.png"
                )
                .setTimestamp()
        );
    } catch (error) {
        log.error(new Error(error));
        responseMessage.edit(
            new MessageEmbed().setDescription(`取得に失敗しました。`)
        );
    }
});

client.login(bot.discord.token);
