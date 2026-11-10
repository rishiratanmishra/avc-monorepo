import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { requireTrustedOrigin } from "./middleware/trusted-origin.js";
import { attachRequestId } from "./middleware/request-id.js";
import { adminRouter } from "./modules/auth/admin.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(attachRequestId);
app.use(requireTrustedOrigin);

app.get("/", (_request, response) => {
  response.json({ name: "AVC Pet Hospital API", status: "ok" });
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);
