import { Router } from "express";
import {
register,
login,
getAllUsers,
toggleUserStatus,
updateProfile
} from "../controllers/AuthenicationController";
import { upload } from "../middlewares/multer";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get('/users', getAllUsers);
authRouter.patch('/users/status/:id', toggleUserStatus);
authRouter.put('/update-profile',upload.single('avatar'), updateProfile);
export default authRouter;