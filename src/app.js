import express from "express";
import AppError from "./utils/appError.js";
import cors from "cors";
import errorHandler from "./controller/errorHandler.js";
import mainRouter from "./routes/index.js";
import { startScheduler } from "./utils/scheduler.js";
import { cpuMonitoring } from "./utils/monitoring.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "API is running successfully",
  });
});

app.use(`/api`, mainRouter);

// to handled unregister endpoint
// app.all("*", (req, res, next) => {
//   //   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(errorHandler);

startScheduler(); // Start the message scheduler
cpuMonitoring(); // Start CPU monitoring

export default app;
