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
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const slug = roomName.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens and make lowercase
    await fetch(`${PARTYKIT_URL}/parties/chatroom/${slug}`, {
      method: "POST",
    });
    router.push(`/chat/${slug}`);
  };

  return (
    <div className="mt-6 flex flex-row flex-wrap justify-start items-center gap-2">
      {process.env.NODE_ENV === 'development' && (
        <form onSubmit={handleSubmit} className="flex flex-row gap-2">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="border border-stone-400 p-2"
          />
          <button
            type="submit"
            className="bg-stone-200 hover:bg-stone-300 px-2 py-1 rounded"
            disabled={!roomName.trim()}
          >
            Create Room
          </button>
        </form>
      )}
    </div>
  );
}
