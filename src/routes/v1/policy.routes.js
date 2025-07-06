import { Router } from "express";
import {
  aggregatedPolicyByEachUser,
  getPolicyInfo,
  uploadPolicyFile,
} from "../../controller/v1/policy.controller.js";
import { uploadPolicyFileMiddleware } from "../../config/multer/config.js";

const policyRouter = Router();

policyRouter.post("/upload", uploadPolicyFileMiddleware, uploadPolicyFile);
policyRouter.get("/info/:username", getPolicyInfo);
policyRouter.get("/aggregate/users", aggregatedPolicyByEachUser);

export default policyRouter;
