import { Router } from "express";
import { logger } from "../lib/logging";
import { prom } from "../lib/prometheus";
const router = Router();

// <link rel=alternate href=https://rumble.com/api/Media/oembed.json?url=https%3A%2F%2Frumble.com%2Fembed%2Fv2x4i5w%2F
async function getEmbedId(urlId: string) {
    const res = await fetch(new URL(urlId, "https://rumble.com"));
    const html = await res.text();

    const regex =
        /<link rel=alternate href="https:\/\/rumble\.com\/api\/Media\/oembed\.json\?url=(.+)" title=.+ type=application\/json\+oembed>/;
    const match = html.match(regex);
    if (!match) return;

    const embedUrl = new URL(decodeURIComponent(match[1]));
    const id = embedUrl.pathname.split("/")[2];
    return id;
}

// https://rumble.com/embedJS/u3/?request=video&ver=2&v=v2x4i5w
async function getVideoId(embedId: string) {
    const res = await fetch(
        `https://rumble.com/embedJS/u3/?request=video&ver=2&v=${embedId}`
    );
    const json = await res.json();
    return json.vid as number | undefined;
}

async function urlIdToStreamId(urlId: string) {
    const embedId = await getEmbedId(urlId);
    if (!embedId) throw new Error(`Cannot find embed ID | urlId: ${urlId}`);
    const id = await getVideoId(embedId);
    if (!id) throw new Error(`Cannot get video ID | embedId: ${embedId}`);
    return id;
}

router.get("/chat/:video", async (req, res) => {
    prom.httpRequests.inc({ endpoint: "/chat/:video" });
    if (!req.params.video) {
        return res.status(400).send();
    }

    const id = req.params.video.split("-")[0];
    let sid: number;
    try {
        sid = await urlIdToStreamId(id);
    } catch (err) {
        logger.error("GetStreamFromVideoID", (err as Error).message);
        return res.status(500).send();
    }

    return res.json({
        streamId: sid,
    });
});

router.get("/chat/channel/:channel", async (req, res) => {
    prom.httpRequests.inc({ endpoint: "/chat/channel/:channel" });
    if (!req.params.channel) {
        return res.status(400).send();
    }

    let sid: number;
    try {
        sid = await urlIdToStreamId(`/c/${req.params.channel}/live/`);
    } catch (err) {
        logger.error("GetStreamFromChannel", (err as Error).message);
        return res.status(500).send();
    }

    return res.json({
        streamId: sid,
    });
});

router.get("/chat/user/:user", async (req, res) => {
    prom.httpRequests.inc({ endpoint: "/chat/user/:user" });
    if (!req.params.user) {
        return res.status(400).send();
    }

    let sid: number;
    try {
        sid = await urlIdToStreamId(`/user/${req.params.user}/live/`);
    } catch (err) {
        logger.error("GetStreamFromUser", (err as Error).message);
        return res.status(500).send();
    }

    return res.json({
        streamId: sid,
    });
});

export { router as chat };
