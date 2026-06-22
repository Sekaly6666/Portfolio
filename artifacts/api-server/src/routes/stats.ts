import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, plansTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  const projects = await db.select().from(projectsTable);
  const plans = await db.select().from(plansTable);

  const completed = projects.filter((p) => p.status === "termine" || p.status === "terminé").length;
  const sitesSupervised = projects.filter((p) => p.status !== "planifie" && p.status !== "planifié").length;

  res.json({
    projectsCompleted: completed || projects.length,
    sitesSupervised: sitesSupervised || projects.length,
    yearsExperience: 3,
    plansCreated: plans.length || 0,
  });
});

export default router;
