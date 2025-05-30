import { ActionFunction, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  if (id) {
    await prisma.blogPost.delete({ where: { id, userId } });
  }
  return redirect("/blog");
};

export default function DeleteBlogPost() {
  return null;
}
