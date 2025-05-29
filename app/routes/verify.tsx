import { json, LoaderFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return json({ error: "Invalid verification link." }, { status: 400 });
  }
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) {
    return json({ error: "Invalid or expired verification token." }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null },
  });
  return json({ success: true, message: "Your account has been verified. You can now log in." });
};

export default function Verify() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">Account Verified</h1>
        <p className="text-white text-center">Your account has been verified. You can now <a href="/login" className="text-cyan-400 underline">log in</a>.</p>
      </div>
    </div>
  );
}
