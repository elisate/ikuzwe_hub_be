import { Router } from "express";
import {
register,
login,
getAllUsers,
toggleUserStatus,
updateProfile
} from "../controllers/AuthenicationController";
import { upload } from "../middlewares/multer";
import {checkActiveStatus} from"../middlewares/checkActive"
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", checkActiveStatus,login);
authRouter.get('/users', getAllUsers);
authRouter.patch('/users/status/:id', toggleUserStatus);
authRouter.put('/update-profile',upload.single('avatar'), updateProfile);
export default authRouter;