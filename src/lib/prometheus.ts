import { Gauge } from "prom-client";

const rumbleConnections = new Gauge({
    name: "service_rumble_connections_total",
    help: "Number of Rumble chat streams connected to",
});

const clientConnections = new Gauge({
    name: "service_client_connections_total",
    help: "Number of clients connected to service",
});

export const prom = {
    rumbleConnections,
    clientConnections,
};
