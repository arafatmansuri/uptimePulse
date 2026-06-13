import { Router } from "express";
import { addWebsite, getWebsiteStatus } from "../../controllers/v1/websiteController";

const websitesRouter = Router();

websitesRouter.post("/websites", addWebsite);
websitesRouter.get("/status/:websiteId", getWebsiteStatus);

export default websitesRouter;