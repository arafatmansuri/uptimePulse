import { Router } from "express";
import { changePassword, getuser, signIn, signOut, signUp, updateProfile } from "../../controllers/v1/userController";
import { userMiddleware } from "../../middlewares/userMiddleware";

const usersRouter = Router();

usersRouter.post("/signup", signUp);
usersRouter.post("/signin", signIn);

usersRouter.use(userMiddleware);
usersRouter.get("/me", getuser);
usersRouter.put("/profile", updateProfile);
usersRouter.put("/password", changePassword);
usersRouter.post("/signout", signOut);

export default usersRouter;