import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the MongoDB:", error);
  });
