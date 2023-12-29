import { roomtbl, bookingtbl, usertbl } from "@prisma/client";

//roomtbl 데이터를 안전하게 표현하기 위한 타입 createdAt는 제외 하고 대신 string 표현
export type SafeRoom = Omit<roomtbl, "createdAt"> & {
  createdAt: string;
};

export type SafeBooking = Omit<bookingtbl, "createdAt" | "starttime" | "endtime" | "roomtbl"> & {
  createdAt: string;
  starttime: string;
  endtime: string;
  roomtbl: SafeRoom;
};

export type SafeUser = Omit<usertbl, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};


