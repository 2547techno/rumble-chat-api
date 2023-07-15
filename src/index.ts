import Express from "express";
import cors from "cors";
import { routes } from "./routes/routes";
const app = Express();

const PORT = process.env.PORT ?? 8080;

app.use(cors());
app.use(routes);

app.listen(PORT, () => {
    console.log("[EXPRESS] Listenting on", PORT);
});
