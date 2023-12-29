'use client';
import React, { useEffect, useState } from "react";
import useInterval from "react-useinterval";

const DateTimeClock = () => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    updateDateTime();
  }, []);

  useInterval(() => {
    updateDateTime();
  }, 1000);

  function updateDateTime() {
    const now = new Date();

    const optionsDate: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const koreanDate = now.toLocaleDateString("ko-KR", optionsDate);

    const optionsDay: Intl.DateTimeFormatOptions = {
      weekday: "long",
    };
    const koreanDay = now.toLocaleDateString("ko-KR", optionsDay);

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const koreanTime = now.toLocaleTimeString("en-US", optionsTime);
    

    setCurrentDate(koreanDate);
    setCurrentDay(koreanDay);
    setCurrentTime(koreanTime);
  }

  return (
    <div className="min-w-[230px] flex flex-col text-right lg:text-2xl">
      <p>
        {currentDate} {currentDay}
      </p>
      <p></p>
      <p className="text-3xl lg:text-5xl ">{currentTime}</p>
    </div>
  );
};

export default DateTimeClock;
