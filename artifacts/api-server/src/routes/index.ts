import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import plansRouter from "./plans";
import blogRouter from "./blog";
import contactRouter from "./contact";
import statsRouter from "./stats";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/projects", projectsRouter);
router.use("/plans", plansRouter);
router.use("/blog", blogRouter);
router.use("/contact", contactRouter);
router.use("/stats", statsRouter);
router.use("/media", mediaRouter);

export default router;
