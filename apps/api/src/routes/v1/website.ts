import { Router } from "express";
import { addWebsite, deleteWebsite, getWebsites, getWebsiteStatus, updateWebsite } from "../../controllers/v1/websiteController";
import { userMiddleware } from "../../middlewares/userMiddleware";

const websitesRouter = Router();

websitesRouter.use(userMiddleware);
websitesRouter.post("/", addWebsite);
websitesRouter.put("/:id", updateWebsite);
websitesRouter.delete("/:id", deleteWebsite);
websitesRouter.get("/:id", getWebsiteStatus);
websitesRouter.get("/", getWebsites);

export default websitesRouter;