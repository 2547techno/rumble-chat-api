import { Gauge } from "prom-client";

const rumbleConnections = new Gauge({
    name: "service_rumble_connections_total",
    help: "some help",
});

export const prom = {
    rumbleConnections,
};
