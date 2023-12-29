"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import useInterval from "react-useinterval";

const DateClock2: React.FC = () => {
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
      weekday: "short"
    };
    const koreanDay = now.toLocaleDateString("ko-KR", optionsDay);
    const englishDay = now.toLocaleDateString("en-US", optionsDay);

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
    setCurrentDay(englishDay);
    setCurrentTime(koreanTime);

    //setAmPm(koreanAmPm);
  }

  return (
    <>
      <div className="flex flex-col overflow-hidden text-white align-middle items-end text-right">
        <div className="flex-col text-white text-sm sm:text-[40px] sm:leading-[40px]">
          {currentDate} {currentDay}
        </div>
        <div className="flex h-full font-semibold align-middle text-[20px] sm:text-[60px]">
          <div className="flex flex-row whitespace-nowrap align-middle">
            <span className="flex whitespace-nowrap ">
              {amPm === "AM" ? "오전" : "오후"}{" "}
            </span>
            <span className="flex justify-end pl-2">
              {parseInt(currentTime.split(":")[0], 10)}
            </span>
            <span
              className={`${
                blink ? "opacity-20" : ""
              } flex align-middle transition-all duration-500 ease-in-out`}
            >
              :
            </span>
            <span className="inline-block text-right">
              {currentTime.split(":")[1]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateClock2;
