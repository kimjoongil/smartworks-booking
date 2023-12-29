import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    roomId,
    userId,
    user_email,
    starttime,
    endtime,
    attendees,
    topic,
    booking_user,
    booking_pwd,
    checkin,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      return NextResponse.error(); // 누락된 필드가 있으면 오류 응답을 반환
    }
  });

  // 기존 예약 중 중복되는 것이 있는지 확인
  const existingBooking = await prisma.bookingtbl.findFirst({
    where: {
      roomId: Number(roomId),
      OR: [
        {
          starttime: {
            lte: new Date(starttime),
          },
          endtime: {
            gte: new Date(starttime),
          },
        },
        {
          starttime: {
            lte: new Date(endtime),
          },
          endtime: {
            gte: new Date(endtime),
          },
        },
      ],
    },
  });

  // 중복된 예약이 있다면 오류 응답을 반환
  if (existingBooking) {
    return NextResponse.error();
  }


  const booking = await prisma.bookingtbl.create({
    data: {
      roomId,
      userId,
      user_email,
      starttime,
      endtime,
      attendees,
      topic,
      booking_user,
      booking_pwd,
      checkin,
    },
  });

  return NextResponse.json(booking);
}

