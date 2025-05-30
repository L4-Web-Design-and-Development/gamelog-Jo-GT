import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { registerUser, createUserSession } from "../utils/auth.server";
import { sendVerificationEmail } from "../utils/email.server";
import { randomBytes } from "crypto";
import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import siteLogo from "../assets/svg/gamelog-logo.svg";
import { useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const profilePic = formData.get("profilePic") as string | undefined;
  const finalProfilePic = profilePic && profilePic !== '' ? profilePic : "/assets/svg/gamelog-logo.svg";
  try {
    const user = await registerUser(email, password, username, finalProfilePic);
    return createUserSession(user.id, "/");
  } catch (e) {
    return json({ error: "User already exists or invalid data" }, { status: 400 });
  }
};

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const [profilePic, setProfilePic] = useState("");
  const handleImageUploaded = (url: string) => setProfilePic(url);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <img src={siteLogo} alt="GameLog Logo" className="h-20 w-20 mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        {actionData?.error && (
          <div className="text-red-500 text-center mb-2">{actionData.error}</div>
        )}
        <form method="post" className="flex flex-col gap-4 w-full">
          <input name="email" type="email" placeholder="Email" required className="input input-bordered text-black" />
          <input name="username" type="text" placeholder="Username" required className="input input-bordered text-black" />
          <input name="password" type="password" placeholder="Password" required className="input input-bordered text-black" />
          <div>
            <label htmlFor="profilePicUpload" className="block text-slate-400 mb-2">Profile Picture (optional)</label>
            <ImageUploader onImageUploaded={handleImageUploaded} inputId="profilePicUpload" />
            {profilePic && <img src={profilePic} alt="Profile preview" className="mt-2 h-16 w-16 rounded-full mx-auto" />}
            <input type="hidden" name="profilePic" value={profilePic} />
          </div>
          <button type="submit" className="btn btn-primary w-full">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
