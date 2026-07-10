import { Router } from "express";
import { getuser, signIn, signOut, signUp, updateProfile } from "../../controllers/v1/userController";
import { userMiddleware } from "../../middlewares/userMiddleware";

const usersRouter = Router();

usersRouter.post("/signup", signUp);
usersRouter.post("/signin", signIn);

usersRouter.use(userMiddleware);
usersRouter.get("/me", getuser);
usersRouter.put("/profile", updateProfile);
usersRouter.post("/signout", signOut);

export default usersRouter;