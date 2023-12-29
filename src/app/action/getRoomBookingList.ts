import prisma from "@/libs/prismadb";

interface IRoomParams {
  roomId?: string;
  starttime?: string;
  endtime?: string;
}

export default async function getRoomBookingList(
  params: IRoomParams
) {
  try {
    const { roomId, starttime, endtime } = params;

    const query: any = {};

    if (roomId) {
      query.roomId = Number(roomId);
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
    query.starttime = { gte: new Date() };
    query.endtime = { gte: new Date() };

    const roomBooking = await prisma.bookingtbl.findMany({
      where: query,
      include: {
        roomtbl: true,
      },
      orderBy: {
        starttime: "asc",
      },
    });

    const safeBooking = roomBooking.map((booking) => ({
      ...booking,
      starttime: booking.starttime?.toISOString(),
      endtime: booking.endtime?.toISOString(),
      roomtbl: {
        ...booking.roomtbl,
        createdAt: booking.roomtbl.createdAt.toISOString(),
      },
    }));

    return safeBooking;
  } catch (error: any) {
    throw new Error(error);
  }
}  
 