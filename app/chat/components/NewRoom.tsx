"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PARTYKIT_URL } from "@/app/env";
import { useSession } from "next-auth/react";


// export default function NewRoom(props: { slug: string }) {
//   const { slug } = props;
//   const router = useRouter();

//   const handleClick = async (e: FormEvent) => {
//     e.preventDefault();
//     await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
//       method: "POST",
//     });
//     router.push(`/chat/${slug}`);
//   };

//   return (
//     <div className="mt-6 flex flex-row flex-wrap justify-start items-center gap-2">
//       <p>
//         Create a new room:{" "}
//         <span className="font-medium bg-yellow-50 whitespace-nowrap">
//           {slug}
//         </span>
//         .
//       </p>
//       <form onSubmit={handleClick}>
//         <button
//           type="submit"
//           className="bg-stone-200 hover:bg-stone-300 px-2 py-1 rounded whitespace-nowrap"
//         >
//           Enter -&gt;
//         </button>
//       </form>
//     </div>
//   );
// }


export default function NewRoom() {
  const { data: session } = useSession();
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();

  //   // Use the roomName as the slug or create a slug from the roomName
  //   const slug = roomName.toLowerCase().replace(/\s+/g, '-');

  //   // In development, allow creating rooms with custom names
  //   // if (process.env.NODE_ENV === 'development') { 
  //   //   await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
  //   //     method: "POST",
  //   //   });
  //   // }

  //   // Create the room in the production environment
  //   try {
  //     const response = await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
  //       method: "POST",
  //     });

  //     if (!response.ok) {
  //       // Handle error here, for example, log the error or show an error message
  //       console.error("Failed to create room:", response.statusText);
  //       return;
  //     }

  //     // Optionally store additional room data using the Storage API
  //     // This step would involve using the storage API to save any room-related information

  //     router.push(`/chat/${slug}`);
  //   } catch (error) {
  //     // Handle fetch error
  //     console.error("Fetch error:", error);
  //   }

  // };

  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  
  //   // Use the roomName as the slug or create a slug from the roomName
  //   const slug = roomName.toLowerCase().replace(/\s+/g, '-');
  
  //   // Create the room in the development environment
  //   const devURL = `${PARTYKIT_URL}/parties/chatroom/${slug}`;
  //   try {
  //     await fetch(devURL, {
  //       method: "POST",
  //     });
  //   } catch (error) {
  //     // Handle fetch error in development
  //     console.error("Failed to create room in development:", error);
  //   }
  
  //   // Create the room in the production environment
  //   // const prodURL = `${PRODUCTION_PARTYKIT_URL}/parties/chatroom/${slug}`;
  //   const PROD_PARTYKIT_URL = "https://partykit-nextjs-chat-template.jackjnn.partykit.dev"; 
  //   const prodURL = `${PROD_PARTYKIT_URL}/parties/chatroom/${slug}`;
  //   try {
  //     await fetch(prodURL, {
  //       method: "POST",
  //     });
  //   } catch (error) {
  //     // Handle fetch error in production
  //     console.error("Failed to create room in production:", error);
  //   }
  
  //   // Optionally store additional room data using the Storage API
  //   // This step would involve using the storage API to save any room-related information
  
  //   // Redirect to the chat room
  //   router.push(`/chat/${slug}`);
  // };

  
  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  //   // Use the roomName as the slug or create a slug from the roomName
  //   const slug = roomName.toLowerCase().replace(/\s+/g, '-');

  //   // In development, allow creating rooms with custom names
  //   const devURL = `${PARTYKIT_URL}/parties/chatroom/${slug}`;
  //   try {
  //     await fetch(devURL, {
  //       method: "POST",
  //     });
  //     router.push(`/chat/${slug}`);
  //   } catch (error) {
  //     // Handle fetch error in development
  //     console.error("Failed to create room:", error);
  //   }
  // };

  // const isUserAuthorized = () => {
  //   // Define a list of authorized email addresses
  //   const authorizedEmails = ['admin@example.com', 'jacknyange2023@gmail.com'];
  //   // Check if the authenticated user's email is in the list of authorized emails
  //   return authorizedEmails.includes(session?.user?.email || '');
  // };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // // Check if user is authorized before creating a room
    // if (!isUserAuthorized()) {
    //   alert("You are not authorized to create a room.");
    //   return;
    // }

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
