import { Router } from "express";
import { uploadPolicyFile } from "../../controller/v1/policy.controller.js";
import { uploadPolicyFileMiddleware } from "../../config/multer/config.js";

const policyRouter = Router();

policyRouter.post("/upload", uploadPolicyFileMiddleware, uploadPolicyFile);

export default policyRouter;
