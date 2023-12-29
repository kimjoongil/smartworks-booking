"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimeSelectorProps {
  onStartTimeChange: (startTime: Date | null) => void;
  onEndTimeChange: (endTime: Date | null) => void;
}

const TimeSelector = ({ onStartTimeChange, onEndTimeChange }: TimeSelectorProps) => {

  const [selectDate, setSelectDate] = useState(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const times = [];
  // 시간 간격을 30분 단위로 생성 8시부터 20시까지
  for (let i = 8; i <= 20; i += 0.5) {
    times.push(new Date().setHours(Math.floor(i), (i % 1) * 60, 0, 0));
  }

  //시간 선택 초기화
  const handleTimeClick = (time: number) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(new Date(time));
      setEndTime(null);
      setHoverTime(null); // 추가: 마우스 오버 상태 리셋
    } else if (startTime && !endTime) {
      if (time === startTime.getTime()) {
        // Do nothing if the selected time is the same as the current start time        
        return;
      } else if (time < startTime.getTime()) {
        setEndTime(startTime);
        setStartTime(new Date(time));
      } else {
        setEndTime(new Date(time));
      }
      setHoverTime(null); // 추가: 마우스 오버 상태 리셋
    }
  };

  //시작시간 변경
  const isTimeSelected = (time: number) => {
    if (startTime && endTime) {
      return time >= startTime.getTime() && time <= endTime.getTime();
    }
    return startTime?.getTime() === time;
  };

  const formatDateWithTime = (date: Date | null, time: Date | null): string => {
    if (!date || !time) return "";

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return `${formattedDate} ${time.getHours().toString().padStart(2, "0")}:${
      time.getMinutes() === 0 ? "00" : "30"
    }`;
  };

  
  const [hoverTime, setHoverTime] = useState<Date | null>(null);

  // 마우스 오버 시 선택된 시간 범위 표시
  const isTimeInRange = (time: number) => {
    if (!startTime || hoverTime === null || endTime) return false;
    const start = startTime.getTime();
    const hover = hoverTime.getTime();
    if (hover < start) {
      return time <= start && time >= hover;
    } else {
      return time >= start && time <= hover;
    }    
  };


  const dateClass = (date: Date) => {
    return selectDate?.getTime() === date.getTime()
      ? "bg-blue-100 text-white"
      : "";
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  return (
    <div>
      <DatePicker
        selected={selectDate}
        onChange={(date: Date) => {
          setSelectDate(date);
          setStartTime(null);
          setEndTime(null);
        }}
        todayButton="오늘"
        dateFormat="yyyy-MM-dd"
        placeholderText="날짜를 선택하세요"
        minDate={new Date()}
        className="peer p-4 font-light bg-white border-[1px] rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              focus:border-black
        "
        calendarClassName="flex flex-col"
        dateFormatCalendar="yyyy년 MM월"
        dayClassName={dateClass}
        isClearable
      />

      {selectDate && (
        <div className="flex flex-col">
          <div className="my-3 grid grid-cols-5 ">
            {times.map((time) => (
              <button
                key={time}
                className={`m-1 px-4 py-2 border border-gray-200 rounded
                      ${
                        isTimeSelected(time) || isTimeInRange(time)
                          ? "bg-black text-white"
                          : "text-black"
                      }
                      ${
                        isToday(selectDate) && new Date(time) <= new Date()
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }
                    `}
                onClick={() => {
                  handleTimeClick(time);
                  onStartTimeChange(startTime);
                  onEndTimeChange(endTime);
                }}
                onMouseEnter={() => !endTime && setHoverTime(new Date(time))}
                onMouseLeave={() => !endTime && setHoverTime(null)}
                disabled={isToday(selectDate) && new Date(time) <= new Date()}
              >
                {new Date(time).getHours().toString().padStart(2, "0")}:
                {new Date(time).getMinutes() === 0 ? "00" : "30"}
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            <div>
              시작시간:
              {startTime && <>{formatDateWithTime(selectDate, startTime)}</>}
            </div>
            <div>
              종료시간:
              {endTime && <>{formatDateWithTime(selectDate, endTime)}</>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
