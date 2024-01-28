import type * as Party from "partykit/server";
import ChatRoomsServer from "./chatRooms";

// export default class PartyServer {
//   constructor(public party: Party.Party) {}
// }

export default (party: Party.Party) => {
  console.log("PartyServer starting");
  new ChatRoomsServer(party);
  console.log("ChatRoomsServer instantiated");
};