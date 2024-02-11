import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PARTYKIT_URL } from "@/app/env";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Example path: /api/proxy/chatroom/{roomId}
  const pathMatch = path.match(/\/api\/proxy\/chatroom\/(.+)/);
  if (pathMatch) {
    const roomId = pathMatch[1]; // Extract the room ID from the path

    // Ensure the ROOM_ID is not undefined or null
    if (!roomId) {
      return new NextResponse("Room ID is missing", { status: 400 });
    }

    // Use PARTYKIT_URL in your middleware
    const externalApiUrl = `${PARTYKIT_URL}/parties/chatroom/${roomId}`;
    // const externalApiUrl = `${process.env.PARTYKIT_URL}/parties/chatroom/${roomId}`;

    console.log(`Proxying to URL: ${externalApiUrl}`);
    console.log(`Environment Variable PARTYKIT_URL: ${process.env.PARTYKIT_URL}`);
    console.log(`NEXT_PUBLIC_PARTYKIT_HOST: ${process.env.NEXT_PUBLIC_PARTYKIT_HOST}`);

    try {
      const externalResponse = await fetch(externalApiUrl, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      // Return the response from the external API to the client
      const body = await externalResponse.text();
      return new NextResponse(body, {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        headers: externalResponse.headers,
      });
    } catch (error) {
      console.error("Error proxying request:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  if (path === "/") {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && path === "/protected") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
