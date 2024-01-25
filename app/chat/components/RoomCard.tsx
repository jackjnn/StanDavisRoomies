import Link from "next/link";
import { RoomInfo } from "@/party/chatRooms";
import Avatar from "@/app/components/Avatar";

export default function RoomCard(props: { room: RoomInfo }) {
  const { room } = props;

  // Log the image URL to the console
  console.log(`Room ID: ${room.id}, Image URL: ${room.image}`);
  console.log("hello world")

  return (
    <li className="col-span-1 divide-y divide-stone-200">
      <Link href={`/chat/${room.id}`}>
        <div className="rounded-lg bg-white outline outline-1 outline-stone-200 shadow hover:shadow-md">
          <div className="w-full bg-cover bg-center h-40" style={{ backgroundImage: `url(${room.image})` }}>
            {/* Image will be displayed here */}
          </div>
          <div className="flex w-full items-start justify-between p-4 sm:p-6 space-x-4 sm:space-x-6">
            <div className="flex-1 flex items-center">
              <h3 className="font-medium">{room.id}</h3>
            </div>

            <span>
              <span className="bg-stone-100 text-stone-600 rounded-full px-2 py-1">
                {room.connections}
                {/* <span> interested {room.connections !== 1 && "🥳"}</span> */}
                <span> want{room.connections == 1 && "s"} to chat {room.connections >= 1 && "🥳"} 🥹</span>
              </span>
            </span>
          </div>

          <div className="p-4 sm:p-6">
            <span className="flex flex-reverse row -space-x-2">
              {room.users?.map((u) => (
                <Avatar
                  key={u.username}
                  username={u.username}
                  image={u.image ?? null}
                  variant={u.present ? "normal" : "ghost"}
                />
              ))}
            </span>
          </div>
          <div className="flex w-full items-center justify-center p-4 sm:p-6 space-x-4 sm:space-x-6 border-t border-stone-200">
            Join -&gt;
          </div>
        </div>
      </Link>
    </li>
  );
}
