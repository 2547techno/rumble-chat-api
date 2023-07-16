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
    help: "The number of messages received from all streams"
})

export const prom = {
    rumbleConnections,
    clientConnections,
    clientConnectionsSum,
    messagesReceived
};
