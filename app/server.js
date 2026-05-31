const express = require("express");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 3000;

client.collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const requestCounter = new client.Counter({
  name: "app_http_requests_total",
  help: "Total number of HTTP requests handled by the app",
  labelNames: ["method", "route", "status_code"],
});

app.use((req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const route = req.route && req.route.path ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    requestCounter.inc(labels);
    endTimer(labels);
  });

  return next();
});

app.get("/", (_req, res) => {
  res.json({
    message: "Hello from Docker, Jenkins, Prometheus, and Grafana!",
    endpoints: ["/health", "/metrics"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/work", async (_req, res) => {
  const delayMs = Math.floor(Math.random() * 500) + 50;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  res.json({ status: "done", delayMs });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
