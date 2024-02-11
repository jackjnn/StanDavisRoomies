import type * as Party from "partykit/server";
import { User } from "./utils/auth";

/**
 * The chatRooms party's purpose is to keep track of all chat rooms, so we want
 * every client to connect to the same room instance by sharing the same room id.
 */
export const SINGLETON_ROOM_ID = "list";

// const authorizedEmails = ['admin@example.com', 'jacknyange2023@gmail.com'];

/** Chat room sends an update when participants join/leave */
export type RoomInfoUpdateRequest = {
  id: string;
  connections: number;
  action: "enter" | "leave";
  user?: User;
};

/** Chat room notifies us when it's deleted  */
export type RoomDeleteRequest = {
  id: string;
  action: "delete";
};

/** Chat rooms sends us information about connections and users */
export type RoomInfo = {
  id: string;
  connections: number;
  imageUrl?: string;
  address?: string; 
  description?: string; 
  users: {
    username: string;
    joinedAt: string;
    leftAt?: string;
    present: boolean;
    image?: string;
  }[];
};

interface RoomCreationRequestBody {
  id: string;
  imageUrl: string;
}

export default class ChatRoomsServer implements Party.Server {
  options: Party.ServerOptions = {
    hibernate: true,
    // this opts the chat room into hibernation mode, which
    // allows for a higher number of concurrent connections
  };

  constructor(public party: Party.Party) {
    // console.log("DEBUG: ChatRoomsServer started");
  }

  async onConnect(connection: Party.Connection) {
    // when a websocket connection is established, send them a list of rooms
    connection.send(JSON.stringify(await this.getActiveRooms()));
  }

  async onRequest(req: Party.Request) {
    console.log("DEBUG: OnRequest called and req next")
    console.log("DEBUG: req -> ", req.url)

    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Specify your domain
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    // we only allow one instance of chatRooms party
    // if (this.party.id !== SINGLETON_ROOM_ID) return notFound();

    // we only allow one instance of chatRooms party
    if (this.party.id !== SINGLETON_ROOM_ID) {
      return new Response(null, { headers, status: 404 });
    }

    // Clients fetch list of rooms for server rendering pages via HTTP GET
    // if (req.method === "GET") return json(await this.getActiveRooms());
    // Clients fetch list of rooms for server rendering pages via HTTP GET
    if (req.method === "GET") {
      const rooms = await this.getActiveRooms();
      return new Response(JSON.stringify(rooms), { headers, status: 200 });
    }

    // Inside your existing onRequest method
    if (req.method === "POST") {
      // const body = await req.json() as RoomCreationRequestBody;
      const body = await req.json() as RoomCreationRequestBody & { address?: string; description?: string; };

      // Retrieve or create new room info
      let roomInfo = await this.party.storage.get<RoomInfo>(body.id) || {
        id: body.id,
        connections: 0,
        users: [],
        imageUrl: body.imageUrl,
        address: body.address, // Handle address
        description: body.description, // Handle description
      };

      // If room exists but doesn't have an imageUrl, update it
      if (!roomInfo.imageUrl) {
        roomInfo.imageUrl = body.imageUrl;
      }

      // Save the updated roomInfo
      await this.party.storage.put(body.id, roomInfo);

      // Broadcast the updated list of rooms
      const updatedRooms = await this.getActiveRooms();
      this.party.broadcast(JSON.stringify(updatedRooms));
  
      // Example of including CORS headers in the response
      return new Response(JSON.stringify({ message: "Room created successfully", roomInfo }), { headers, status: 200 });
    }


    // admin api for clearing all rooms (not used in UI)
    if (req.method === "DELETE") {
      await this.party.storage.deleteAll();
      // return json({ message: "All room history cleared" });
      return new Response(JSON.stringify({ message: "All room history cleared" }), { headers, status: 200 });
    }

    // return notFound();
    // If none of the above HTTP methods match, return a not found response
    return new Response("Method not allowed", { headers, status: 405 });
  }

  /** Fetches list of active rooms */
  async getActiveRooms(): Promise<RoomInfo[]> {
    const roomsMap = await this.party.storage.list<RoomInfo>();
    // Convert the Map values to an array, then map over the array
    const rooms = Array.from(roomsMap.values()).map(room => ({
      ...room,
      imageUrl: room.imageUrl || 'apa3.jpeg'
    }));
    return rooms;
  }

  /** Fetches list of active rooms */
  // async getActiveRooms(): Promise<RoomInfo[]> {
  //   // Hardcoded list of rooms
  //   return [
  //     { id: 'Ocean View 3 Bed Apartment in Brickell', connections: 0, users: [], image: '/apa1.jpeg' },
  //     { id: 'City View 3 Bed Apartment in Downtown', connections: 0, users: [], image: '/apa3.jpeg'  },
  //     { id: 'City View 3 Bed Apartment in Edgewater', connections: 0, users: [], image: '/apa2.jpeg'  },
  //     { id: 'City View 3 Bed Apartment in Brickell', connections: 0, users: [], image: '/apa4.jpeg'  },
  //     { id: 'Ocean View 3 Bed Apartment in Miami Beach', connections: 0, users: [], image: '/apa5.jpeg'  },
  //     // Add more rooms as needed
  //   ];
  // }

  /** Updates list of active rooms with information received from chatroom */
  async updateRoomInfo(req: Party.Request) {
    const update = (await req.json()) as
      | RoomInfoUpdateRequest
      | RoomDeleteRequest;

    // console.log("DEBUG Before update:", await this.getActiveRooms());

    if (update.action === "delete") {
      await this.party.storage.delete(update.id);
      return this.getActiveRooms();
    }

    const persistedInfo = await this.party.storage.get<RoomInfo>(update.id);
    if (!persistedInfo && update.action === "leave") {
      return this.getActiveRooms();
    }

    const info = persistedInfo ?? {
      id: update.id,
      connections: 0,
      users: [],
    };

    info.connections = update.connections;

    const user = update.user;
    if (user) {
      if (update.action === "enter") {
        // bump user to the top of the list on entry
        info.users = info.users.filter((u) => u.username !== user.username);
        info.users.unshift({
          username: user.username,
          image: user.image,
          joinedAt: new Date().toISOString(),
          present: true,
        });
      } else {
        info.users = info.users.map((u) =>
          u.username === user.username
            ? { ...u, present: false, leftAt: new Date().toISOString() }
            : u
        );
      }
    }

    await this.party.storage.put(update.id, info);

    // console.log("DEBUG After update:", await this.getActiveRooms());

    return this.getActiveRooms();
  } 
}
