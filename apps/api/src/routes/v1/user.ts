import { Router } from "express";
import { signUp } from "../../controllers/v1/userController";

const usersRouter = Router();

usersRouter.post("/signup", signUp);

export default usersRouter;