export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  POLICY_FILE_PATH: process.env.POLICY_FILE_PATH || "uploads/policies",
  DB_URL: "mongodb://localhost:27017/insuredmine",
  WORKER_FILE:
    process.env.WORKER_FILE || `${process.cwd()}/src/workers/worker.js`,
};
console.log(process.cwd());
