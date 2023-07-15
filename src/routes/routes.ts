import { Router } from "express";
import { chat } from "./chat";
import { events } from "./events";
import { emotes } from "./emotes";

export const routes = Router();

routes.use(chat);
routes.use(events);
routes.use(emotes);
