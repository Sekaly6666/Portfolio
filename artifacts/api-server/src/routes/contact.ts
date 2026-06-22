import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";
import { SendMessageBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(contactMessagesTable).orderBy(contactMessagesTable.createdAt);
  res.json(rows.map(toMessage));
});

router.post("/", async (req, res) => {
  const parse = SendMessageBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(contactMessagesTable).values(parse.data).returning();
  res.status(201).json(toMessage(row));
});

function toMessage(r: typeof contactMessagesTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    message: r.message,
    read: r.read,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
