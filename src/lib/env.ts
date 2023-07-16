import { config } from "dotenv";
import assert from "assert";

export function loadEnv() {
    config();
    assert(
        process.env.METRICS_KEY !== undefined,
        "Missing METRICS_KEY environment variable"
    );
}
