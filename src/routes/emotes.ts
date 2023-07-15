import { Router } from "express";
const router = Router();

type Emote = {
    id: number;
    name: string;
    packId: number;
    emotesPackId: number;
    isSubsOnly: boolean;
    moderationStatus: string;
    file: string;
};

async function getEmotes(sid: string): Promise<Emote[]> {
    const out: Emote[] = [];

    const res = await fetch(
        `https://rumble.com/service.php?name=emote.list&chat_id=${sid}`
    );
    if (!res.ok) return [];

    const json = await res.json();

    for (const set of json.data.items) {
        for (const emote of set.emotes) {
            const e: Emote = {
                id: emote.id,
                name: emote.name,
                packId: emote.pack_id,
                emotesPackId: emote.emotes_pack_id,
                isSubsOnly: emote.is_subs_only,
                moderationStatus: emote.moderation_status,
                file: emote.file,
            };
            out.push(e);
        }
    }

    return out;
}

router.get("/emotes/:sid", async (req, res) => {
    const emotes = await getEmotes(req.params.sid);

    res.json(emotes);
});

export { router as emotes };
