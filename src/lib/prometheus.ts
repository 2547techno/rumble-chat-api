import { Gauge } from "prom-client";

const rumbleConnections = new Gauge({
    name: "service_rumble_connections_total",
    help: "Number of Rumble chat streams connected to",
});

const clientConnections = new Gauge({
    name: "service_client_connections_total",
    help: "Number of clients connected to service per stream",
    labelNames: ["sid"],
});

const clientConnectionsSum = new Gauge({
    name: "service_client_connections_sum_total",
    help: "Number of clients connected to service total",
});

export const prom = {
    rumbleConnections,
    clientConnections,
    clientConnectionsSum
};
