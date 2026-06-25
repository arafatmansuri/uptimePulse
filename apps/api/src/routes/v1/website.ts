import { Router } from "express";
import { addWebsite, getWebsites, getWebsiteStatus } from "../../controllers/v1/websiteController";
import { userMiddleware } from "../../middlewares/userMiddleware";

const websitesRouter = Router();

websitesRouter.use(userMiddleware);
websitesRouter.post("/", addWebsite);
websitesRouter.get("/:id", getWebsiteStatus);
websitesRouter.get("/", getWebsites);

export default websitesRouter;