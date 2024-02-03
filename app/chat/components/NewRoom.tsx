"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PARTYKIT_URL } from "@/app/env";
import { useSession } from "next-auth/react";

export default function NewRoom() {
  const { data: session } = useSession();
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Use the roomName as the slug or create a slug from the roomName
    const slug = roomName.toLowerCase().replace(/\s+/g, '-');
    
    // Post the new room to your PartyKit server
    try {
      await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
        method: "POST",
      });
      router.push(`/chat/${slug}`);
    } catch (error) {
      // Handle fetch error
      console.error("Failed to create room:", error);
    }
  };

  // Define a list of authorized emails
  const authorizedEmails = ['admin@example.com', 'jacknyange2023@gmail.com'];

  // Use type assertion to ensure that session.user is not undefined
  const userEmail = session?.user?.email as string;

  // Check if the signed-in user's email is in the list of authorized emails
  const isAuthorized = session && authorizedEmails.includes(userEmail);

  // Render the create room form only if the user is authorized
  return isAuthorized ? (
    <div className="mt-6">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
          className="border p-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Create Room
        </button>
      </form>
    </div>
  ) : null;

  
}
