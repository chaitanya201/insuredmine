import { Router } from "express";
import v1Router from "./v1/index.js";

const mainRouter = Router();

mainRouter.use("/v1", v1Router);

export default mainRouter;
