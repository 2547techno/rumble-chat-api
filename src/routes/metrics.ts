import { Router } from "express";
import { register } from "prom-client";
const router = Router();

router.get("/metrics", async (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.METRICS_KEY}`) {
        return res.status(403).send();
    }
    
    res.set("content-type", register.contentType);
    res.end(await register.metrics());
});

export { router as metrics };
