import { NextResponse } from "next/server";

import getCurrentUser from "@/app/action/getCurrentUser";
import prisma from "@/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await prisma.bookingtbl.deleteMany({
    where: {
      id: Number(reservationId),
      OR: [{ userId: Number(currentUser.id) }],
    },
  });

  return NextResponse.json(reservation);
}
