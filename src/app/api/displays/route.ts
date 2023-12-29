import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {

  const body = await request.json();
  const { bookingId, checkin, starttime, endtime } = body;

  if (!bookingId) {
    return NextResponse.error();
  }

  let data = {};
  
  if (checkin === "Y") {
    
    if (!endtime) {
      data = {
        checkin: "Y",
      };    
    }else {
      data = {
        endtime: new Date(endtime),
      };
    }

    if (starttime) {
      data = {
        checkin: "Y",
        starttime: new Date(starttime),
      };
    }

  } else if (checkin === "N") {

    if (endtime) {
      data = {
        checkin: "N",
        endtime: new Date(endtime),
      };
    }
  }

  const bookingRegistration = await prisma.bookingtbl.update({
    where: {
      id: bookingId,
    },
    data,
  });
  return NextResponse.json(bookingRegistration);
}
