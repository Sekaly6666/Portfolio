import { Router } from "express";
import { db } from "@workspace/db";
import { mediaTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateMediaBody, DeleteMediaParams, ListMediaQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parseResult = ListMediaQueryParams.safeParse(req.query);
  const params = parseResult.success ? parseResult.data : {};

  const rows = await db.select().from(mediaTable).orderBy(mediaTable.createdAt);

  let filtered = rows;
  if (params.type) {
    filtered = filtered.filter((r) => r.type === params.type);
  }
  if (params.projectId !== undefined) {
    filtered = filtered.filter((r) => r.projectId === params.projectId);
  }

  res.json(filtered.map(toMedia));
});

router.post("/", async (req, res) => {
  const parse = CreateMediaBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(mediaTable).values(parse.data).returning();
  res.status(201).json(toMedia(row));
});

router.delete("/:id", async (req, res) => {
  const parse = DeleteMediaParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(mediaTable).where(eq(mediaTable.id, parse.data.id));
  res.status(204).send();
});

function toMedia(r: typeof mediaTable.$inferSelect) {
  return {
    id: r.id,
    url: r.url,
    type: r.type,
    title: r.title ?? null,
    description: r.description ?? null,
    projectId: r.projectId ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
