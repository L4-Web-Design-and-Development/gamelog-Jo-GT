import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { loginUser, createUserSession } from "../utils/auth.server";
import siteLogo from "../assets/svg/gamelog-logo.svg";
import { PrismaClient } from "@prisma/client";
import { useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Find user by email
  let user = null;
  if (email && email.trim() !== "") {
    user = await prisma.user.findUnique({ where: { email } });
  }
  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }
  // Validate password and verification
  const loginResult = await loginUser(user.email, password);
  if (loginResult === "unverified") {
    return json({ error: "Please verify your email before logging in." }, { status: 400 });
  }
  if (!loginResult) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }
  return createUserSession(user.id, "/");
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <img src={siteLogo} alt="GameLog Logo" className="h-20 w-20 mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">Log in</h1>
        {actionData?.error && (
          <div className="text-red-500 text-center mb-2">{actionData.error}</div>
        )}
        <form method="post" className="flex flex-col gap-4 w-full">
          <input name="email" type="email" placeholder="Email" required className="input input-bordered bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-cyan-400" />
          <input name="password" type="password" placeholder="Password" required className="input input-bordered bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-cyan-400" />
          <button type="submit" className="btn btn-primary w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">Log in</button>
        </form>
        <div className="mt-4 text-center text-slate-400">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-cyan-400 underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
