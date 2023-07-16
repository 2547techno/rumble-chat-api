import { Router } from "express";
import { register } from "prom-client";
const router = Router();

router.get("/metrics", async (req, res) => {
    res.set("content-type", register.contentType);
    res.end(await register.metrics());
});

export { router as metrics };
