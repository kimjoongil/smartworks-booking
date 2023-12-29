import prisma from "@/libs/prismadb";

interface IParams {
  displayId?: string;
}

export default async function getDisplayById(
  params: IParams
) {
  try {
    const { displayId } = params;
    const roomBooking = await prisma.roomtbl.findUnique({
      where: {
        id: Number(displayId),
      },
      include: {
        bookingtbl:{
          select:{ roomtbl: true, starttime: true, endtime: true, checkin: true }
        }
      },
    });

    if (!roomBooking) {
      return null;
    }

    return {
      ...roomBooking,
      createdAt: roomBooking.createdAt.toISOString(),
      
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
