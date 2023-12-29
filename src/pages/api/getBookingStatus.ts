import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type bookingtblWhereInput = {
  roomId?: number;
  starttime?: {
    gte?: Date;
    lt?: Date;
  };
  endtime?: {
    gte?: Date;
    lt?: Date;
  };
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { roomId } = req.query;

  if (!roomId || typeof roomId !== "string") {
    return res
      .status(400)
      .json({ error: "roomId is required and must be a string" });
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  try {
    const bookingStatus = await prisma.bookingtbl.findMany({
      where: {
        roomId: parseInt(roomId, 10),
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      } as bookingtblWhereInput,
    });

    res.status(200).json(bookingStatus);
  } catch (error) {
    console.error("Error fetching booking status:", error);
    res.status(500).json({ error: "Unable to fetch booking status" });
  } finally {
    await prisma.$disconnect();
  }
};
