import prisma from "@/libs/prismadb";

interface IParams {
  roomId?: string;
  userId?: number;
  
}

export default async function getReservations(params: IParams) {
  try {
    const { roomId, userId } = params;

    const query: any = {};

    if (roomId) {
      query.roomId = Number(roomId);
    }

    if (userId) {
      query.userId = Number(userId);
    }

    const reservations = await prisma.bookingtbl.findMany({
      where: query,
      include: {
        roomtbl: true,
      },
      orderBy: {
        starttime: "desc",
      },
    });

    const SafeBooking = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt?.toISOString(),
      startDate: reservation.starttime?.toISOString(),
      endDate: reservation.endtime?.toISOString(),
      bookingtbl: {
        ...reservation.roomtbl,
        createdAt: reservation.roomtbl?.createdAt.toISOString(),
      },
    }));

    return SafeBooking;
  } catch (error: any) {
    throw new Error(error);
  }
}
