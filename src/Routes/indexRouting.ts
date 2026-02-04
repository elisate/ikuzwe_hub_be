import { Router } from "express";
import authRouter from "./authRoutes";
import programRoutes from "./programRoutes";
const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/program", programRoutes);

export default mainRouter;
