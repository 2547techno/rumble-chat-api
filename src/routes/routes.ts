import { Router } from "express";
import { chat } from "./chat";
import { events } from "./events";
import { emotes } from "./emotes";
import { metrics } from "./metrics";

export const routes = Router();

routes.use(chat);
routes.use(events);
routes.use(emotes);
routes.use(metrics);
