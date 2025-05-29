import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { registerUser, createUserSession } from "../utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const user = await registerUser(email, password);
    return createUserSession(user.id, "/");
  } catch (e) {
    return json({ error: "User already exists or invalid data" }, { status: 400 });
  }
};

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form method="post" className="flex flex-col gap-4 w-80">
        <input name="email" type="email" placeholder="Email" required className="input input-bordered" />
        <input name="password" type="password" placeholder="Password" required className="input input-bordered" />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
