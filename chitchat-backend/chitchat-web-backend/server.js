import express from "express";
import bodyParser from "body-parser";
import { connect } from "./mongo.js";

import cors from "cors";
import { authRoutes } from "./routes/auth.route.js";
import { apiRoutes } from "./routes/api.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const allowedOrigins = [
  "https://chitchat.fans",
  "https://www.chitchat.fans",
  "https://www.chitchat-ai.com",
  "https://chitchat-ai.com",
  "https://chitchat-ai-mm27.onrender.com",
  "https://chitchat-ai-dev.onrender.com",
  "http://localhost:3001",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const errorMsg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(errorMsg), false);
      }

      return callback(null, true);
    },
    credentials: true, // Allow the server to accept cookies from the client
  })
);
const port = 3000;

// connect mongo client
connect();

// Body parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Cookie Parser
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api", apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
