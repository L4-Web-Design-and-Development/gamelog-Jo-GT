import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { loginUser, createUserSession } from "../utils/auth.server";
import siteLogo from "../assets/svg/gamelog-logo.svg";
import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import { PrismaClient } from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const profilePic = formData.get("profilePic") as string | undefined;
  const user = await loginUser(email, password);
  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }
  if (profilePic && profilePic !== user.profilePic) {
    await prisma.user.update({ where: { id: user.id }, data: { profilePic } });
  }
  return createUserSession(user.id, "/");
};

export default function Login() {
  const [profilePic, setProfilePic] = useState("");
  const handleImageUploaded = (url: string) => setProfilePic(url);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <img src={siteLogo} alt="GameLog Logo" className="h-20 w-20 mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-center">Log in</h1>
        <form method="post" className="flex flex-col gap-4 w-full">
          <input name="email" type="email" placeholder="Email" required className="input input-bordered" />
          <input name="password" type="password" placeholder="Password" required className="input input-bordered" />
          <div>
            <label htmlFor="profilePicUpload" className="block text-slate-400 mb-2">Profile Picture (optional)</label>
            <ImageUploader onImageUploaded={handleImageUploaded} inputId="profilePicUpload" />
            {profilePic && <img src={profilePic} alt="Profile preview" className="mt-2 h-16 w-16 rounded-full mx-auto" />}
            <input type="hidden" name="profilePic" value={profilePic} />
          </div>
          <button type="submit" className="btn btn-primary w-full">Log in</button>
        </form>
      </div>
    </div>
  );
}
