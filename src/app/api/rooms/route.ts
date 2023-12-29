import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/app/action/getCurrentUser";


export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { roomimg, roomname, capacity, roomstate, roomdesc, roometc } = body;

  // Object.keys(body).forEach((value: any) => {
  //   if (!body[value]) {
  //     NextResponse.error();
  //   }
  // });

  const room = await prisma.roomtbl.create({
    data: {
      roomimg,
      roomname,
      capacity,
      roomstate,
      roomdesc,
      roometc,
    },
  });

  return NextResponse.json(room);
}
