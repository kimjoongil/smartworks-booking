import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";


export async function PATCH(request: Request) {
  const body = await request.json();
  const {
    id,
    roomId,
    userId,
    user_email,
    starttime,
    endtime,
    attendees,
    topic,
    booking_user,
    booking_pwd,    
  } = body;

  if (!id) {
    return NextResponse.error();
  }

  const booking = await prisma.bookingtbl.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!booking || booking.booking_pwd !== booking_pwd) {    
    return new Response(
      JSON.stringify({ message: "비밀번호가 맞지 않습니다." }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 중복되는 예약이 있는지 확인합니다. 단, 현재 수정하고 있는 예약은 제외합니다.
  const existingBooking = await prisma.bookingtbl.findFirst({
    where: {
      id: {
        not: Number(id),
      },
      roomId: Number(roomId),
      AND: [
        {
          starttime: {
            lt: new Date(endtime),
          },
        },
        {
          endtime: {
            gt: new Date(starttime),
          },
        },
      ],
    },
  });

  if (existingBooking) {
    // 중복된 예약이 있으면 에러를 반환합니다.
    return new Response(
      JSON.stringify({ error: "This time slot is already booked" }),
      {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 예약을 업데이트합니다.
  const updatedBooking = await prisma.bookingtbl.update({
    where: {
      id: Number(id),
    },
    data: {
      roomId: Number(roomId),
      userId: Number(userId),
      user_email,
      starttime: new Date(starttime),
      endtime: new Date(endtime),
      attendees: Number(attendees),
      topic,
      booking_user,
    },
  });

  // 업데이트된 예약 정보를 반환합니다.
  return new Response(JSON.stringify(updatedBooking), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
