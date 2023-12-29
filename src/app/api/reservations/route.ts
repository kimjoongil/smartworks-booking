import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/app/action/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { roomId, starttime, endtime } = body;

  if (!roomId || !starttime || !endtime ) {
    return NextResponse.error();
  }

  const roomAndReservation = await prisma.roomtbl.update({
    where: {
      id: roomId,
    },
    data: {      
      bookingtbl: {
        create: {
          starttime,
          endtime,
        },
      },
    }
  });
  return NextResponse.json(roomAndReservation);
}
