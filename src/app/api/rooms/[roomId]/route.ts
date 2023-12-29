import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: Request,
  { params }: { params: { roomId: string } }
) => {
  const today = new Date();

  const bookings = await prisma.bookingtbl.findMany({
    where: {
      roomId: Number(params.roomId),
      starttime: {
        gte: today,
      },
    },
    select: {
      id: true,
      roomId: true,
      userId: true,
      user_email: true,
      starttime: true,
      endtime: true,
      attendees: true,
      topic: true,
      booking_user: true,
      booking_pwd: true,
      checkin: true,
      createdAt: true,
      roomtbl: {
        // 룸 Table과 join
        select: {
          roomimg: true,
          roomname: true,
          capacity: true,
          roomstate: true,
          roomdesc: true,
          roometc: true,
        },
      },
    },
    orderBy: {
      starttime: "asc",
    },
  });

  return NextResponse.json(bookings, { status: 200 });
};
