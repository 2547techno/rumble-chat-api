import Express from "express";
import { routes } from "./routes/routes";
const app = Express();

const PORT = process.env.PORT ?? 8080;

app.use(routes);

app.listen(PORT, () => {
    console.log("[EXPRESS] Listenting on", PORT);
});
