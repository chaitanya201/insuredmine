import policyRouter from "./policy.routes.js";
import { Router } from "express";

const v1Router = Router();
v1Router.use("/policy", policyRouter);

export default v1Router;
