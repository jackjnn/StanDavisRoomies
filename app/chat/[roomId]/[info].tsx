// app/chat/[roomId]/[info].tsx
import { useRouter } from 'next/router';

const RoomInfo = () => {
  const router = useRouter();
  const { roomId } = router.query;

  return (
    <div>
      <h1>Room Information</h1>
      <p>Room ID: {roomId}</p>
      {/* Display more room information here */}
    </div>
  );
};

export default RoomInfo;