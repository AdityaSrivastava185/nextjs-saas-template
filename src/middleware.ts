import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/register",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    // If user is authenticated and on public route, redirect to appropriate dashboard
    if (userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        console.log("users" , user)
        const role = user.publicMetadata.role as string | undefined;

        return NextResponse.redirect(
          new URL(
            role === "admin" ? "/admin/dashboard" : "/dashboard",
            req.url
          )
        );
      } catch (error) {
        console.error("Error fetching user data from Clerk:", error);
        return NextResponse.redirect(new URL("/error", req.url));
      }
    }
    return NextResponse.next();
  }

  // Require authentication for all non-public routes
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Handle role-based access control for authenticated users
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role as string | undefined;

    // Redirect admin users from regular dashboard to admin dashboard
    if (role === "admin" && req.nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Prevent non-admin users from accessing admin routes
    if (role !== "admin" && isAdminRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    console.error("Error fetching user data from Clerk:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};