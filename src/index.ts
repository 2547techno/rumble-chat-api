import Express from "express";
import { routes } from "./routes/routes";
const app = Express();

app.use(routes);

app.listen(8080, () => {
    console.log("listening");
});
