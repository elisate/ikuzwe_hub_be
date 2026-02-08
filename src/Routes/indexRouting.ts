import { Router } from "express";
import authRouter from "./authRoutes";
import programRoutes from "./programRoutes";
import teamRoutes from "./teamRoutes";
import newsRouter from "./newsRoute";
import contactRouter from "./contactRoute";
import logoutRouter from "./logoutRoute";
import donationRouter from "./donationRoute";
import success_storyRouter from "./success_storyRoute";
import achievementRouter from "./key-achievementRoute";
import impactRouter from "./impactRoute";
const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/program", programRoutes);
mainRouter.use("/team", teamRoutes);
mainRouter.use("/news", newsRouter);
mainRouter.use("/contact", contactRouter);  // Add contact routes
mainRouter.use("/logout", logoutRouter);  // Add logout routes
mainRouter.use("/donation", donationRouter);  // Add logout routes
mainRouter.use("/success_story", success_storyRouter); 
mainRouter.use("/achievement", achievementRouter);
mainRouter.use("/impact", impactRouter);

export default mainRouter;
