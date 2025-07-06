import app from "./app.js";
import { SERVER_CONFIG } from "./config/server.config.js";
import { connectToDatabase } from "./db/config/connection.js";

connectToDatabase();

app.listen(SERVER_CONFIG.PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log("Server is running on port..", SERVER_CONFIG.PORT);
});

app.on("listening", () => {
  console.log(`Server is listening on port ${SERVER_CONFIG.PORT}`);
});

app.on("error", (err) => {
  console.error(`Error occurred: ${err.message}`);
});
