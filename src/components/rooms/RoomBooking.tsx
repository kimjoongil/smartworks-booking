"use client";
import { SafeBooking } from "@/types";
import Switch from "@mui/material/Switch";
import { useState } from "react";


interface RoomBookingProps {
  booking?: SafeBooking;
}

const RoomBooking: React.FC<RoomBookingProps> = ({ booking }) => {
  const starttime = new Date(booking.starttime).toISOString().split("T")[1].trimStart().slice(0, 5);
  const starDay = new Date(booking.starttime).toISOString().split("T")[0].trimEnd().slice(8, 12);
  const endtime = new Date(booking.endtime).toISOString().split("T")[1].trimStart().slice(0, 5);
  
  const now = new Date();
  const sdate = new Date(booking.starttime);
  const edate = new Date(booking.endtime);
  
  sdate.setHours(sdate.getHours() - 9);
  edate.setHours(edate.getHours() - 9);

  const start = new Date(sdate);
  const end = new Date(edate);
  const isCurrent = start <= now && now <= end;
  const isPast = end < now;
  
  
  const [checked, setChecked] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setChecked(true);
  };


  return (
    <>
      <div
        className={`flex flex-col relative p-5 rounded-md m-1 text-slate-600 ${
          isCurrent
            ? "bg-amber-500 text-white"
            : isPast
            ? "bg-gray-200"
            : "bg-sky-200"
        }`}
      >
        <div className="text-lg">주제 : {booking.topic}</div>
        <div className="text-base">
          시간 : {starDay}일 {starttime} ~ {endtime}
        </div>
        <div className="text-base">
          {booking.booking_user} 외 {booking.attendees} 명
        </div>
        {isPast ? <div className="absolute right-6">Check Out</div> : ""}

        {isCurrent && (
          <div className="absolute right-6 text-white flex flex-col items-center">
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
              defaultChecked
              className="opacity-100"
            />
            <span>이용 중</span>
          </div>
        )}

        {!isPast && !isCurrent && (
          <div className="absolute right-4 bottom-4 text-white">
            <div className="bg-amber-400  rounded-3xl py-2 px-4 border-[3px] border-white shadow-slate-700 drop-shadow-lg">
              {starttime} 부터 이용 가능
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoomBooking;