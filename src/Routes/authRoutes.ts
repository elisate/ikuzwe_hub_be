import { Router } from "express";
import {
register,
login,
getAllUsers,
toggleUserStatus,
updateProfile
} from "../controllers/AuthenicationController";
import { upload } from "../middlewares/multer";
import { checkActiveStatus } from "../middlewares/checkActive";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get('/users', getAllUsers);

// Toggle status (e.g., PATCH /users/deactivate/123)
authRouter.patch('/users/status/:id', toggleUserStatus);
authRouter.put('/update-profile',  upload.single('avatar'), updateProfile);

// Example of a protected route that checks if the user is still active
// authRouter.get('/profile', checkActiveStatus);
export default authRouter;