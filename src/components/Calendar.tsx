"use client";
import React from "react";

interface CalendarProps {
  reservedTimes: { startTime: string; endTime: string }[];
  setSelectedDate: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  reservedTimes,
  setSelectedDate,
}) => {
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const isTimeReserved = (time: string) => {
    return reservedTimes.some((reserved) => {
      return (
        new Date(time) >= new Date(reserved.startTime) &&
        new Date(time) <= new Date(reserved.endTime)
      );
    });
  };

  const renderTimeCells = (date: string) => {
    const timeCells = [];
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const startTime = new Date(currentDate);
        startTime.setHours(i, j, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        const isReserved = isTimeReserved(startTime.toISOString());

        timeCells.push(
          <div
            key={startTime.toISOString()}
            className={`time-cell ${isReserved ? "reserved" : ""}`}
            onClick={() => handleDateSelect(startTime.toISOString())}
          >
            {startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      }
    }

    return timeCells;
  };

  return (
    <div className="calendar">{renderTimeCells(new Date().toISOString())}</div>
  );
};

export default Calendar;
