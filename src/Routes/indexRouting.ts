import { Router } from "express";
import authRouter from "./authRoutes";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

export default mainRouter;
