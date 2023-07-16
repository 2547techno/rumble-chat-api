import EventSource from "eventsource";
import { events } from "./events";
import { logger } from "./logging";
import { prom } from "./prometheus";
export const streams: Map<number, EventSource> = new Map();
export const connections: Map<number, number> = new Map();

setInterval(() => {
    for (const key of connections.keys()) {
        if (!connections.has(key)) continue;

        if (
            streams.get(key)?.readyState === EventSource.CLOSED ||
            Number(connections.get(key)) <= 0
        ) {
            removeStream(key);
        }
    }
}, 30_000);

enum MessageType {
    INIT = "init",
    MESSAGES = "messages",
    DELETE_NON_RANT = "delete_non_rant_messages",
}

function removeStream(sid: number) {
    streams.get(sid)?.close();
    streams.delete(sid);
    connections.delete(sid);
    logger.info("SSE", `Removed ${sid}`);
    prom.rumbleConnections.dec();
    prom.clientConnections.remove({ sid });
}

export async function addStream(sid: number) {
    if (streams.has(sid)) return;

    const res = await fetch(
        `https://web7.rumble.com/chat/api/chat/${sid}/stream`
    );
    if (res.status === 204 || !res.ok)
        throw new Error(`Cannot connect to chat | status ${res.status}`);

    const sse = new EventSource(
        `https://web7.rumble.com/chat/api/chat/${sid}/stream`
    );
    sse.addEventListener("message", (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type as MessageType) {
            case MessageType.INIT: {
                // events.emit(`chat-${sid}`, data.data);
                /*
                    Initial messages will only be sent to clients who triggered
                    the creation of the EventSource (and any joined at the same time)
                    
                    Since I don't want to keep a list of latest messages for a stream,
                    future connected clients will not receive an inital list of messages

                    I'd rather not send the initial message altogether to be consistent
                */
                break;
            }
            case MessageType.MESSAGES: {
                events.emit(`chat-${sid}`, data.data);
                break;
            }
            case MessageType.DELETE_NON_RANT: {
                logger.info(
                    "SSE",
                    `delete_non_rant_messages message for ${sid}`
                );
                break;
            }
            default: {
                logger.info("SSE", "Undefined message type!", msg);
            }
        }
    });

    streams.set(sid, sse);
    logger.info("SSE", `Added ${sid}`);
    prom.rumbleConnections.inc();
}
