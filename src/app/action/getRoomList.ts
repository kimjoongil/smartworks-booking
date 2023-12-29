import prisma from "@/libs/prismadb";

export interface IRoomListParams {
  id?: number;
  roomimg?: string;
  roomname?: string;
  capacity?: number;
  roomstate?: boolean;
  roomdesc?: string;
  roometc?: string;
  createdAt?: string;
  starttime?: string;
  endtime?: string;
}

export default async function getRoomList(params: IRoomListParams = {}) {
  try {
    const {
      id,
      roomimg,
      roomname,
      capacity,
      roomstate,
      roomdesc,
      roometc,
      createdAt,
      starttime,
      endtime,
    } = params;

    let query: any = {};

    if (id) {
      query.id = id;
    }

    if (roomimg) {
      query.roomimg = roomimg;
    }

    if (roomname) {
      query.roomname = roomname;
    }

    if (capacity) {
      query.capacity = capacity;
    }

    if (roomstate) {
      query.roomstate = roomstate;
    }

    if (roomdesc) {
      query.roomdesc = roomdesc;
    }

    if (roometc) {
      query.roometc = roometc;
    }
    if (createdAt) {
      query.createdAt = createdAt;
    }

    if (starttime && endtime) {
      query.NOT = {
        bookingtbl: {
          some: {
            OR: [
              {
                endtime: { gte: starttime },
                starttime: { lte: starttime },
              },
              {
                starttime: { lte: endtime },
                endtime: { gte: endtime },
              },
            ],
          },
        },
      };
    }

    const roomlist = await prisma.roomtbl.findMany({
      where: query,
      orderBy: {
        createdAt: "asc",
      },
    });

    const safeRooms = roomlist.map((room) => ({
      ...room,
      createdAt: room.createdAt.toISOString(),
    }));

    return safeRooms;
  } catch (e: any) {
    throw new Error(e);
  }
}
