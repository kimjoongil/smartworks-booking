import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { displayId } = req.query;

  if (req.method === "GET") {
    try {
      const bookings = await prisma.bookingtbl.findMany({
        where: {
          roomId: Number(displayId),
        },
      });
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
  } else {
    res.status(405).end();
  }
}
