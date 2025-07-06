import { Router } from "express";
import { saveScheduledMessage } from "../../controller/v1/message.controller.js";

const messageRouter = Router();

messageRouter.post("/save", saveScheduledMessage);

export default messageRouter;
