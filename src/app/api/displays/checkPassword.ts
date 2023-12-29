// pages/api/checkPassword.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.error();
  }

  const { bookingId, Password } = req.body as any; // 타입을 정의하여 사용하면 더 좋습니다.

  if (!bookingId || !Password) {
    return NextResponse.error();
  }

  const booking = await prisma.bookingtbl.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    return NextResponse.error();
  }

  if (booking.booking_pwd !== Password) {
    return NextResponse.error();
  }

  return NextResponse.json(booking);
}
