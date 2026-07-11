import { Router } from "express";
import { changePassword, deleteAccount, getuser, refreshAccessToken, signIn, signOut, signUp, updateProfile } from "../../controllers/v1/userController";
import { userMiddleware } from "../../middlewares/userMiddleware";

const usersRouter = Router();

usersRouter.post("/signup", signUp);
usersRouter.post("/signin", signIn);
usersRouter.post("/refresh-token", refreshAccessToken);

usersRouter.use(userMiddleware);
usersRouter.get("/me", getuser);
usersRouter.put("/profile", updateProfile);
usersRouter.put("/password", changePassword);
usersRouter.delete("/account", deleteAccount);
usersRouter.post("/signout", signOut);

export default usersRouter;