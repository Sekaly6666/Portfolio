import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreatePostBody,
  UpdatePostBody,
  GetPostParams,
  UpdatePostParams,
  DeletePostParams,
  ListPostsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parseResult = ListPostsQueryParams.safeParse(req.query);
  const params = parseResult.success ? parseResult.data : {};

  const rows = await db.select().from(postsTable).orderBy(postsTable.createdAt);

  let filtered = rows;
  if (params.category) {
    filtered = filtered.filter((r) => r.category === params.category);
  }
  if (params.published !== undefined) {
    const pub = String(params.published) === "true";
    filtered = filtered.filter((r) => r.published === pub);
  }

  res.json(filtered.map(toPost));
});

router.post("/", async (req, res) => {
  const parse = CreatePostBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(postsTable).values(parse.data).returning();
  res.status(201).json(toPost(row));
});

router.get("/:id", async (req, res) => {
  const parse = GetPostParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(postsTable).where(eq(postsTable.id, parse.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toPost(row));
});

router.patch("/:id", async (req, res) => {
  const paramParse = UpdatePostParams.safeParse({ id: Number(req.params.id) });
  if (!paramParse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParse = UpdatePostBody.safeParse(req.body);
  if (!bodyParse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(postsTable)
    .set(bodyParse.data)
    .where(eq(postsTable.id, paramParse.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toPost(row));
});

router.delete("/:id", async (req, res) => {
  const parse = DeletePostParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(postsTable).where(eq(postsTable.id, parse.data.id));
  res.status(204).send();
});

function toPost(r: typeof postsTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    excerpt: r.excerpt ?? null,
    category: r.category,
    coverImage: r.coverImage ?? null,
    published: r.published,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
