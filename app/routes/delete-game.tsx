import { ActionFunction, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const prisma = new PrismaClient();
  if (id) {
    await prisma.game.delete({ where: { id } });
  }
  return redirect("/");
};

export default function DeleteGame() {
  return null;
}
