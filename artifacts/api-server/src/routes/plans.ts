import { Router } from "express";
import { db } from "@workspace/db";
import { plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreatePlanBody,
  UpdatePlanBody,
  GetPlanParams,
  UpdatePlanParams,
  DeletePlanParams,
  ListPlansQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parseResult = ListPlansQueryParams.safeParse(req.query);
  const params = parseResult.success ? parseResult.data : {};

  const rows = await db.select().from(plansTable).orderBy(plansTable.createdAt);

  let filtered = rows;
  if (params.category) {
    filtered = filtered.filter((r) => r.category === params.category);
  }

  res.json(filtered.map(toPlan));
});

router.post("/", async (req, res) => {
  const parse = CreatePlanBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(plansTable).values(parse.data).returning();
  res.status(201).json(toPlan(row));
});

router.get("/:id", async (req, res) => {
  const parse = GetPlanParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(plansTable).where(eq(plansTable.id, parse.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toPlan(row));
});

router.patch("/:id", async (req, res) => {
  const paramParse = UpdatePlanParams.safeParse({ id: Number(req.params.id) });
  if (!paramParse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParse = UpdatePlanBody.safeParse(req.body);
  if (!bodyParse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(plansTable)
    .set(bodyParse.data)
    .where(eq(plansTable.id, paramParse.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toPlan(row));
});

router.delete("/:id", async (req, res) => {
  const parse = DeletePlanParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(plansTable).where(eq(plansTable.id, parse.data.id));
  res.status(204).send();
});

function toPlan(r: typeof plansTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description ?? null,
    previewImage: r.previewImage ?? null,
    pdfUrl: r.pdfUrl ?? null,
    surface: r.surface ?? null,
    rooms: r.rooms ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
