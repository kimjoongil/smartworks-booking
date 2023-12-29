"use client";
import { SafeBooking } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TimeSelectorProps {
  selectedDate: Date;
  onTimeChange: (starttime: Date, endtime: Date) => void; // 부모 컴포넌트로 전달할 콜백 함수
  bookedTimes: SafeBooking[];
}

const TimeSelector = ({
  selectedDate,
  onTimeChange,
  bookedTimes,
}: TimeSelectorProps) => {
  const [starttime, setStartTime] = useState<Date | null>(null);
  const [endtime, setEndTime] = useState<Date | null>(null);

  const times = [];
  // 시간 간격을 30분 단위로 생성 8시부터 20시까지
  for (let i = 8; i <= 19; i += 0.5) {
    times.push(
      new Date(selectedDate).setHours(Math.floor(i), (i % 1) * 60, 0, 0)
    );
  }

  const isUnavailableTimeInRange = (start: number, end: number) => {
    for (let t = start; t <= end; t += 30 * 60 * 1000) {
      // 30분씩 증가
      if (isBooked(t)) {
        return true;
      }
    }
    return false;
  };

  /**
   * 예약된 시간 범위 내에 있는지 확인
   * @param start - 시작 시간
   * @param end - 종료 시간
   * @returns 예약된 시간 범위 내에 있으면 true, 아니면 false
   */
  const isInBookedRange = (start: number, end: number) => {
    return bookedTimes.some((booking) => {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localBookingStart = new Date(
        new Date(booking.starttime).getTime() + timezoneOffset
      ).getTime();
      const localBookingEnd = new Date(
        new Date(booking.endtime).getTime() + timezoneOffset
      ).getTime();

      return (
        (start >= localBookingStart && start < localBookingEnd) ||
        (end > localBookingStart && end <= localBookingEnd)
      );
    });
  };

  const isBooked = (time: number) => {
    return bookedTimes.some((booking) => {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000; // 분을 밀리초로 변환
      const localBookingStart = new Date(
        new Date(booking.starttime).getTime() + timezoneOffset
      ).getTime();
      const localBookingEnd = new Date(
        new Date(booking.endtime).getTime() + timezoneOffset
      ).getTime();
      return time >= localBookingStart && time < localBookingEnd;
    });
  };

  //시간 선택 초기화
  const handleTimeClick = (time: number) => {
    // 선택된 시간이 이미 예약된 시간인지 확인
    if (isBooked(time)) return;

    console.log("time: ", time);

    if (!starttime || (starttime && endtime)) {
      setStartTime(new Date(time));
      setEndTime(null);
      setHoverTime(null); //마우스 오버 상태 리셋
    } else if (starttime && !endtime) {
      if (isInBookedRange(starttime.getTime(), time)) {
        // 시작 시간과 클릭한 시간 사이에 이미 예약된 시간이 있는 경우
        toast.error("이미 예약된 시간이 포함되어 있습니다.");
        setStartTime(new Date(time)); // 시작 시간을 클릭한 시간으로 변경
        setEndTime(null);
        setHoverTime(null); // 추가: 마우스 오버 상태 리셋
        return;
      }
      if (time === starttime.getTime()) {
        //시작시간과 종료시간이 같으면 아무것도 하지 않음
        setStartTime(null);
        return;
      } else if (time < starttime.getTime()) {
        //시작시간보다 작으면 시작시간을 변경
        setEndTime(starttime); //종료시간을 시작시간으로 변경
        setStartTime(new Date(time)); //시작시간을 선택한 시간으로 변경
      } else {
        setEndTime(new Date(time));
      }
      setHoverTime(null); // 추가: 마우스 오버 상태 리셋
    }
  };

  const [hoverTime, setHoverTime] = useState<Date>(); // 추가: 마우스 오버 시 선택된 시간 범위 표시

  //시작시간 변경
  const isTimeSelected = (time: number) => {
    if (starttime && endtime) {
      return time >= starttime.getTime() && time <= endtime.getTime();
    }
    return starttime?.getTime() === time;
  };

  // 마우스 오버 시 선택된 시간 범위 표시
  const isTimeInRange = (time: number) => {
    if (!starttime || hoverTime === null || endtime) return false;
    if (isInBookedRange(starttime.getTime(), hoverTime.getTime())) return false;
    const start = starttime.getTime();
    const hover = hoverTime.getTime();

    if (isUnavailableTimeInRange(start, hover)) return false;

    if (hover < start) {
      return time <= start && time >= hover;
    } else {
      return time >= start && time <= hover;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 날짜가 변경되면 선택된 시간 초기화
  useEffect(() => {
    setStartTime(null);
    setEndTime(null);
  }, [selectedDate]);

  // 시작시간과 종료시간이 선택되면 onTimeChange 콜백 함수를 호출하여 부모 컴포넌트로 전달
  useEffect(() => {
    if (starttime && endtime) {
      onTimeChange(starttime, endtime);
    }
  }, [starttime, endtime, onTimeChange]);

  return (
    <>
      <div className="flex w-full my-4">
        {starttime &&
          `${starttime.getHours().toString().padStart(2, "0")}:${
            starttime.getMinutes() === 0 ? "00" : "30"
          }`}{" "}
        ~{" "}
        {endtime &&
          `${endtime.getHours().toString().padStart(2, "0")}:${
            endtime.getMinutes() === 0 ? "00" : "30"
          }`}
      </div>
      {times.map((time) => {
        const isSelected =
          starttime !== null &&
          endtime !== null &&
          time >= starttime &&
          time <= endtime;
        
        return (
          <button
            key={time}
            className={`m-1 py-2 border border-gray-200 rounded text-center
                      ${
                        isTimeSelected(time) || isTimeInRange(time)
                          ? "bg-black text-white"
                          : isBooked(time)
                          ? "bg-gray-200 cursor-not-allowed"
                          : "text-black"
                      }
                      ${
                        isToday(selectedDate) && new Date(time) <= new Date()
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }
                    `}
            onMouseEnter={() => {
              if (!isBooked(time) && !endtime) {
                setHoverTime(new Date(time));
              }
            }}
            onMouseLeave={() => {
              if (!isBooked(time) && !endtime) {
                setHoverTime(null);
              }
            }}
            disabled={
              (isToday(selectedDate) && new Date(time) <= new Date()) ||
              isBooked(time)
            }
            onClick={() => handleTimeClick(time)}
          >
            {new Date(time).getHours().toString().padStart(2, "0")}:
            {new Date(time).getMinutes() === 0 ? "00" : "30"}
          </button>
        );
      })}
    </>
  );
};

export default TimeSelector;
