import { Router } from "express";
import { chat } from "./chat";
import { events } from "./events";

export const routes = Router();

routes.use(chat);
routes.use(events);
