import { Counter, Gauge } from "prom-client";

const rumbleConnections = new Gauge({
    name: "rumble_api_rumble_connections_total",
    help: "Number of Rumble chat streams connected to",
});

const clientConnections = new Gauge({
    name: "rumble_api_client_connections_total",
    help: "Number of clients connected to service per stream",
    labelNames: ["sid"],
});

const messagesReceived = new Counter({
    name: "rumble_api_messages_received_total",
    help: "The number of messages received from all streams",
});

const httpRequests = new Counter({
    name: "rumble_api_http_received_total",
    help: "Number of http requests received per endpoint",
    labelNames: ["endpoint"],
});

export const prom = {
    rumbleConnections,
    clientConnections,
    messagesReceived,
    httpRequests,
};
