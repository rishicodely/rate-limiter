import express from "express";
import rateLimiter from "./middleware/rateLimiter";

const app = express();

app.use(express.json());

app.use(rateLimiter);

app.get("/api/test", (req, res) => {
  res.json({ message: "Request successful" });
});

export default app;
