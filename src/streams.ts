import EventSource from "eventsource";
import { events } from "./events";
export const streams: Map<number, EventSource> = new Map();
export const connections: Map<number, number> = new Map();

setInterval(() => {
    for (const key of connections.keys()) {
        if (!connections.has(key)) continue;

        if (streams.get(key)?.readyState === EventSource.CLOSED) {
            streams.get(key)?.close();
            streams.delete(key);
            connections.delete(key);
            console.log("[SSE] Removed", key, "(closed)");
            continue;
        }

        if (Number(connections.get(key)) <= 0) {
            streams.get(key)?.close();
            streams.delete(key);
            connections.delete(key);
            console.log("[SSE] Removed", key);
        }
    }
}, 30_000);

enum MessageType {
    INIT = "init",
    MESSAGES = "messages",
    DELETE_NON_RANT = "delete_non_rant_messages",
}

export function addStream(sid: number) {
    if (streams.has(sid)) return;

    const sse = new EventSource(
        `https://web7.rumble.com/chat/api/chat/${sid}/stream`
    );
    sse.addEventListener("message", (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type as MessageType) {
            case MessageType.INIT: {
                console.log("[SSE] Init message for", sid);
                break;
            }
            case MessageType.MESSAGES: {
                events.emit(`chat-${sid}`, data.data);
                break;
            }
            case MessageType.DELETE_NON_RANT: {
                console.log("[SSE] delete_non_rant_messages message for", sid);
                break;
            }
            default: {
                console.log("[SSE] Undefined message type!");
                console.log(msg);
            }
        }
    });

    streams.set(sid, sse);
    console.log("[SSE] Added", sid);
}
