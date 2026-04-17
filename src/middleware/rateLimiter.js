import redis from "../config/redis";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 100;

function getCurrentWindow() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
}

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const window = getCurrentWindow();

    const key = `rate_limit:${ip}:${window}`;

    const requestCount = await redis.incr(key);

    if (requestCount === 1) {
      await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, MAX_REQUESTS - requestCount),
    );

    if (requestCount > MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error", error);
    next();
  }
};

export default rateLimiter;
