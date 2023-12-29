import prisma from "@/libs/prismadb";

interface IParams {
  roomId?: string;
}

export default async function getRoomById(
  params: IParams
) {
  try {
    const { roomId } = params;
    const room = await prisma.roomtbl.findUnique({
      where: {
        id: Number(roomId),
      },
    });

    if (!room) {
      return null;
    }

    return {
      ...room,
      createdAt: room.createdAt.toISOString(),
      
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
