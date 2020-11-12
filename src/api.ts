import got from "got";
import { apiLog } from "./log";
import { bot } from "./config";

export const getLowestPriceInSteam = async (plain: string) => {
    try {
        apiLog.debug("trying to fetch lowest price...");
        const body = (await got(
            `https://api.isthereanydeal.com/v01/game/lowest/`,
            {
                searchParams: {
                    key: bot.itad.key,
                    region: "us",
                    shops: "steam",
                    plains: plain,
                },
            }
        ).json()) as any;
        apiLog.debug(body);

        const game = body.data[plain];
        return game;
    } catch (error) {
        apiLog.error(error);
    }
};

export const getPlainGameName = async (url: string) => {
    const regex = /https:\/\/store\.steampowered\.com\/app\/(?<appid>\d+)/;
    const {
        groups: { appid },
    } = url.match(regex);

    if (!appid) apiLog.error(new Error("appid in url is not found."));
    apiLog.debug(`appid found: app/${appid}`);

    try {
        apiLog.debug("trying to fetch plain game name...");

        const body = (await got(
            `https://api.isthereanydeal.com/v01/game/plain/id/`,
            {
                searchParams: {
                    key: bot.itad.key,
                    shop: "steam",
                    ids: `app/${appid}`,
                },
            }
        ).json()) as any;
        apiLog.debug(body);

        const {
            data: { [`app/${appid}`]: plain },
        } = body;

        return { plain, appid };
    } catch (error) {
        apiLog.error(error);
    }
};

export const steamAppdetails = async (appid: string) => {
    try {
        apiLog.debug("trying to fetch plain game name...");

        const body = (await got(
            `https://store.steampowered.com/api/appdetails/`,
            {
                searchParams: {
                    appids: appid,
                },
            }
        ).json()) as any;
        // apiLog.debug(body);

        return body[appid].data;
    } catch (error) {
        apiLog.error(error);
    }
};
