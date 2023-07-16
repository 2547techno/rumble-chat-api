import { Router } from "express";
import { events } from "../lib/events";
import { addStream, connections } from "../lib/streams";
import { prom } from "../lib/prometheus";
const router = Router();

type User = {
    id: string;
    username: string;
    isFollower: boolean;
    profilePicture?: URL;
    color: string;
};

type Message = {
    id: string;
    timestamp: string;
    text: string;
    from: User;
};

function parseMessages(data: any) {
    const messages: Message[] = [];
    const users: Map<string, User> = new Map();

    for (const user of data.users) {
        users.set(user.id, {
            id: user.id,
            username: user.username,
            isFollower: user.is_follower,
            profilePicture: user["image.1"],
            color: user.color,
        });
    }

    for (const message of data.messages) {
        const user = users.get(message.user_id) ?? {
            id: "unknown",
            username: "Unknown",
            isFollower: false,
            color: "#ff0000",
        };

        messages.push({
            id: message.id,
            timestamp: message.time,
            text: message.text,
            from: user,
        });
    }

    prom.messagesReceived.inc(messages.length);
    return messages;
}

router.get("/events/chat/:id", async (req, res) => {
    const sid = Number(req.params.id);
    try {
        await addStream(sid);
    } catch (err) {
        return res.status(404).send();
    }
    connections.set(sid, Number(connections.get(sid) ?? 0) + 1);
    prom.clientConnections.inc({ sid });

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    res.write(
        `data: ${JSON.stringify([
            {
                id: "connected",
                timestamp: "connected",
                text: "",
                from: {
                    id: "connected",
                    username: "Connected to chat!",
                    isFollower: false,
                    color: "#bbbbbb",
                },
            },
        ] as Message[])}\n\n`
    );

    const cb = (data: any) => {
        const messages = parseMessages(data);
        res.write(`data: ${JSON.stringify(messages)}\n\n`);
    };

    events.on(`chat-${req.params.id}`, cb);

    res.on("close", () => {
        connections.set(sid, Number(connections.get(sid) ?? 0) - 1);
        prom.clientConnections.dec({ sid });
        events.removeListener(`chat-${req.params.id}`, cb);
        res.end();
    });
});

export { router as events };
