import { Router } from "express";
import authRouter from "./authRoutes";
import programRoutes from "./programRoutes";
import teamRoutes from "./teamRoutes";
import newsRouter from "./newsRoute";
import contactRouter from "./contactRoute";  
const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/program", programRoutes);
mainRouter.use("/team", teamRoutes);
mainRouter.use("/news", newsRouter);
mainRouter.use("/contact", contactRouter);  // Add contact routes

export default mainRouter;
