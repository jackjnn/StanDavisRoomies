"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PARTYKIT_URL } from "@/app/env";


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
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Use the roomName as the slug or create a slug from the roomName
    const slug = roomName.toLowerCase().replace(/\s+/g, '-');

    // In development, allow creating rooms with custom names
    // if (process.env.NODE_ENV === 'development') { 
    //   await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
    //     method: "POST",
    //   });
    // }

    // Create the room in the production environment
    await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
      method: "POST",
    });

    // Optionally store additional room data using the Storage API
    // This step would involve using the storage API to save any room-related information

    router.push(`/chat/${slug}`);

  };

  return process.env.NODE_ENV === 'development' ? (
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
