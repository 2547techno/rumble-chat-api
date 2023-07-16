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

const clientConnectionsSum = new Gauge({
    name: "rumble_api_client_connections_sum_total",
    help: "Number of clients connected to service total",
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

const httpRequestsSum = new Counter({
    name: "rumble_api_http_received_sum_total",
    help: "Number of http requests received total",
});

export const prom = {
    rumbleConnections,
    clientConnections,
    clientConnectionsSum,
    messagesReceived,
    httpRequests,
    httpRequestsSum,
};
