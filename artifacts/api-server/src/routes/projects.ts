import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  CreateProjectBody,
  UpdateProjectBody,
  GetProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  ListProjectsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parseResult = ListProjectsQueryParams.safeParse(req.query);
  const params = parseResult.success ? parseResult.data : {};

  let query = db.select().from(projectsTable).$dynamic();

  const rows = await query.orderBy(sql`${projectsTable.createdAt} desc`);

  let filtered = rows;
  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params.type) {
    filtered = filtered.filter((r) => r.type === params.type);
  }

  res.json(filtered.map(toProject));
});

router.post("/", async (req, res) => {
  const parse = CreateProjectBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(projectsTable).values(parse.data).returning();
  res.status(201).json(toProject(row));
});

router.get("/stats/summary", async (req, res) => {
  const rows = await db.select().from(projectsTable);
  const total = rows.length;

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    byType[r.type] = (byType[r.type] ?? 0) + 1;
  }

  res.json({
    total,
    byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
  });
});

router.get("/:id", async (req, res) => {
  const parse = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(projectsTable).where(eq(projectsTable.id, parse.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toProject(row));
});

router.patch("/:id", async (req, res) => {
  const paramParse = UpdateProjectParams.safeParse({ id: Number(req.params.id) });
  if (!paramParse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParse = UpdateProjectBody.safeParse(req.body);
  if (!bodyParse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(projectsTable)
    .set(bodyParse.data)
    .where(eq(projectsTable.id, paramParse.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toProject(row));
});

router.delete("/:id", async (req, res) => {
  const parse = DeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, parse.data.id));
  res.status(204).send();
});

function toProject(r: typeof projectsTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    type: r.type,
    surface: r.surface ?? null,
    budget: r.budget ?? null,
    location: r.location ?? null,
    date: r.date ?? null,
    status: r.status,
    coverImage: r.coverImage ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
