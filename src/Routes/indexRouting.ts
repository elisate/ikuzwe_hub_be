import { Router } from "express";
import authRouter from "./authRoutes";
import programRoutes from "./programRoutes";
import teamRoutes from "./teamRoutes";  
const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/program", programRoutes);
mainRouter.use("/team", teamRoutes);

export default mainRouter;
