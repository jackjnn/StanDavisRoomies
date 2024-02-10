"use client";

import { useState } from "react";
import { PARTYKIT_URL } from "@/app/env";
import { useSession } from "next-auth/react";

export default function ClearRoomButton(props: { roomId: string }) {
  const { data: session } = useSession();
  const authorizedEmails = ['admin@example.com', 'jacknyange2023@gmail.com'];
  // Use type assertion to ensure that session.user is not undefined
  const userEmail = session?.user?.email as string;
  // Check if the signed-in user's email is in the list of authorized emails
  const isAuthorized = session && authorizedEmails.includes(userEmail);
  if (!isAuthorized) {
    return null;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const clearRoom = () => {
    fetch(`${PARTYKIT_URL}/parties/chatroom/${props.roomId}`, {
      method: "DELETE",
    });
    setShowConfirmation(false);
  };
  return (
    <>
      {showConfirmation && (
        <div className="flex flex-wrap gap-2 justify-start items-center">
          <button
            className="outline outline-1 outline-red-400 rounded-full px-3 py-1 text-red-400 text-sm hover:bg-red-200 hover:text-red-500 whitespace-nowrap"
            onClick={clearRoom}
          >
            I’m sure! Clear all messages for everyone!
          </button>
          <button
            className="outline outline-1 outline-stone-400 rounded-full px-3 py-1 text-stone-400 text-sm hover:bg-stone-200 hover:text-stone-500 whitespace-nowrap"
            onClick={() => setShowConfirmation(false)}
          >
            No, don’t clear
          </button>
        </div>
      )}
      {!showConfirmation && (
        <button
          className="outline outline-1 outline-stone-400 rounded-full px-3 py-1 text-stone-400 text-sm hover:bg-stone-200 hover:text-stone-500 whitespace-nowrap"
          onClick={() => setShowConfirmation(true)}
        >
          Clear all messages
        </button>
      )}
    </>
  );
}
