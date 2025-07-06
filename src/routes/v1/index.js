import messageRouter from "./message.routes.js";
import policyRouter from "./policy.routes.js";
import { Router } from "express";

const v1Router = Router();
v1Router.use("/policy", policyRouter);
v1Router.use("/message", messageRouter);

export default v1Router;
