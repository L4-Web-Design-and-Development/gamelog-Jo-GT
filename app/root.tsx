import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import NavBar from "./components/NavBar";
import {Footer} from "./components/Footer"
import { getUserId, getUserById } from "./utils/auth.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  let userProfilePic = null;
  if (userId) {
    const user = await getUserById(userId);
    userProfilePic = user?.profilePic || null;
  }
  return { userId, userProfilePic };
};

export default function App() {
  const { userId, userProfilePic } = useLoaderData<{ userId: string | null, userProfilePic: string | null }>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
          <div className="flex-1">
            <NavBar userId={userId} userProfilePic={userProfilePic} />
            <Outlet />
          </div>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}
