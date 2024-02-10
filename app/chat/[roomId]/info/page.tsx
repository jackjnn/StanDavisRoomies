// app/chat/[roomId]/[info].tsx

"use client";
// import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

const RoomInfo = () => {
  const pathname = usePathname();

  // Assuming the URL structure is /chat/[roomId]/info
  // Split the pathname by '/' and get the room ID part
  const parts = pathname.split('/');
  const roomId = parts[2]; // This will be 'awesome-3-bed' for the given URL

  // Now you can use roomId to fetch and display room-specific data
  // ...
  return (
    <div>
      <h1>Room Information</h1>
      {/* <p>Info for room: {roomId ?? 'Loading...'}</p> */}
      <p>Info for room: {roomId}</p>
      {/* Display more room information here */}
    </div>
  );
};

export default RoomInfo;

