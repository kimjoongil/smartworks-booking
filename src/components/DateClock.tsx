"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import useInterval from "react-useinterval";

const DateClock: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [currentDaily, setCurrentDaily] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [amPm, setAmPm] = useState<string>("");
  const [blink, setBlink] = useState<boolean>(false);

  useEffect(() => {
    updateDateTime();
  }, []);

  useInterval(() => {
    updateDateTime();
    setBlink((prev) => !prev);
  }, 1000);

  const updateDateTime = (): void => {
    const now = new Date();

    setCurrentYear(now.getFullYear().toString());

    const optionsDate: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const koreanDate = now.toLocaleDateString("ko-KR", optionsDate);

    const optionsMonth: Intl.DateTimeFormatOptions = {
      month: "narrow",
    };
    
    const koreanMonth = format(now, "MM");    
    const koreanDaily = format(now, "dd");
    const koreanAmPm = format(now, "a");
    

    const optionsDay: Intl.DateTimeFormatOptions = {
      weekday: "long",
    };
    const koreanDay = now.toLocaleDateString("ko-KR", optionsDay);

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    };
    let koreanTime = now.toLocaleTimeString("en-US", optionsTime);

    // 시간 앞에 "AM" 또는 "PM"을 가져옵니다.
    setAmPm(koreanTime.slice(-2));
    koreanTime = koreanTime.slice(0, -3); // " AM" 또는 " PM"을 제거합니다.
    setCurrentDate(koreanDate);
    setCurrentMonth(koreanMonth);
    setCurrentDaily(koreanDaily);
    setCurrentDay(koreanDay);
    setCurrentTime(koreanTime);

    //setAmPm(koreanAmPm);
  }

  return (
    <>
      <div className="flex flex-row overflow-hidden rounded-sm sm:rounded-xl text-black align-middle items-center bg-slate-800 ">
        <div className="flex-col text-right w-2/5 font-light text-white text-[0.85em] p-2 sm:text-base sm:p-5">
          <p>{currentYear}년</p>
          <p>{currentDate}</p>
          <p>{currentDay}</p>
        </div>
        <div className="flex w-3/5 h-full px-5 font-bold items-center align-middle text-sm sm:text-3xl bg-gray-200">
          <div className="flex flex-row whitespace-nowrap align-middle">
            <span className="flex whitespace-nowrap ">
              {amPm === "AM" ? "오전" : "오후"}
            </span>
            <span className="flex sm:w-[41px] justify-end">
              {parseInt(currentTime.split(":")[0], 10)}
            </span>
            <span className={`${blink ? "opacity-20" : ""} flex align-middle`}>
              :
            </span>
            <span className="inline-block sm:w-[41px] text-right">
              {currentTime.split(":")[1]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateClock;
