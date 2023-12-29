/**
 * 예약 시간 선택 컴포넌트
 * @param selectedDate - 선택된 날짜
 * @param onTimeChange - 시작시간과 종료시간이 선택되면 호출되는 콜백 함수
 * @param bookedTimes - 예약된 시간 정보
 * @returns 예약 시간을 선택 컴포넌트
 */
"use client";
import { SafeBooking } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TimePickerProps {
  selectedDate: Date;
  onTimeChange: (starttime: Date, endtime: Date) => void; // 부모 컴포넌트로 전달할 콜백 함수
  bookedTimes: SafeBooking[];
  editingBooking?: SafeBooking; // 수정 중인 예약시간을 추가합니다.
}

const TimePicker = ({
  selectedDate,
  onTimeChange,
  bookedTimes,
  editingBooking, // 수정 중인 예약시간을 props 받기
}: TimePickerProps) => {
  const [starttime, setStartTime] = useState<Date | null>(null);
  const [endtime, setEndTime] = useState<Date | null>(null);

  const times = [];
  // 시간 간격을 30분 단위로 생성 8시부터 20시까지
  for (let i = 8; i <= 20; i += 0.5) {
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

  // DB에서 UTC로 저장된 시간을 로컬 시간으로 변환합니다.
  const convertToLocalTime = (utcDate: string) => {
    const date = new Date(utcDate);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  };

  /**
   * 예약된 시간 범위 내에 있는지 확인
   * @param start - 시작 시간
   * @param end - 종료 시간
   * @returns 예약된 시간 범위 내에 있으면 true, 아니면 false
   */
  /* const isInBookedRange = (start: number, end: number) => {
    return bookedTimes.some((booking) => {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localBookingStart =
        new Date(booking.starttime).getTime() + timezoneOffset;
      const localBookingEnd =
        new Date(booking.endtime).getTime() + timezoneOffset;

      return (
        (start >= localBookingStart && start < localBookingEnd) ||
        (end > localBookingStart && end <= localBookingEnd)
      );
    });
  }; */

  const isInBookedRange = (
    start: number,
    end: number,
    editingBooking?: SafeBooking
  ) => {
    return bookedTimes.some((booking) => {
      // 수정 중인 예약시간이라면 해당 시간을 검사에서 제외합니다.
      if (
        editingBooking &&
        new Date(editingBooking.starttime).getTime() ===
          new Date(booking.starttime).getTime() &&
        new Date(editingBooking.endtime).getTime() ===
          new Date(booking.endtime).getTime()
      ) {
        return false;
      }

      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localBookingStart =
        new Date(booking.starttime).getTime() + timezoneOffset;
      const localBookingEnd =
        new Date(booking.endtime).getTime() + timezoneOffset;

      return (
        (start >= localBookingStart && start < localBookingEnd) ||
        (end > localBookingStart && end <= localBookingEnd)
      );
    });
  };

  /* const isBooked = (time: number) => {
    return bookedTimes.some((booking, i) => {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000; // 분을 밀리초로 변환
      const localBookingStart = new Date(
        new Date(booking.starttime).getTime() + timezoneOffset
      ).getTime();
      const localBookingEnd = new Date(
        new Date(booking.endtime).getTime() + timezoneOffset
      ).getTime();

      return time >= localBookingStart && time < localBookingEnd;
    });
  }; */

  const isBooked = (time: number) => {
    // 수정 중인 예약시간이 있다면 그 시간은 예약된 시간으로 간주하지 않습니다.
    return bookedTimes.some((booking) => {
      // 수정 중인 예약과 현재 검사하는 예약이 동일한지 확인합니다.
      if (
        editingBooking &&
        editingBooking.starttime === booking.starttime &&
        editingBooking.endtime === booking.endtime
      ) {
        return false;
      }

      // 나머지 로직은 동일합니다.
      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localBookingStart = new Date(
        new Date(booking.starttime).getTime() + timezoneOffset
      ).getTime();
      const localBookingEnd = new Date(
        new Date(booking.endtime).getTime() + timezoneOffset
      ).getTime();

      return time >= localBookingStart && time < localBookingEnd;
    });
  };

  const timeformat = (dbtime: string) => {
    const [year, month, day] = dbtime.split("T")[0].split("-").map(Number);
    const [hours, minutes, seconds] = dbtime
      .split("T")[1]
      .split(":")
      .map(Number);
    return [year, month, day, hours, minutes, seconds];
  };

  const formatUnit = (isoTimeString: string): string[] => {
    const date = new Date(isoTimeString);
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 0을 붙여주는 부분
    const day = String(date.getUTCDate()).padStart(2, "0"); // 0을 붙여주는 부분
    const hours = String(date.getUTCHours()).padStart(2, "0"); // 0을 붙여주는 부분
    const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // 0을 붙여주는 부분
    const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // 필요하면 이 부분도 수정

    return [year, month, day, hours, minutes, seconds];
  };

  //시간 선택 초기화
  /*   const handleTimeClick = (time: number) => {
    
    // 선택된 시간이 이미 예약된 시간인지 확인
    if (isBooked(time)) {
      return;
    }

    if (!starttime || (starttime && endtime)) {
      //선택 시간이 없거나 시작시간과 종료시간이 모두 선택된 경우
      setStartTime(new Date(time));
      setEndTime(null);
      setHoverTime(null); //마우스 오버 상태 리셋
    } else if (starttime && !endtime) {
      //시작시간만 선택된 경우

      if (time === starttime.getTime()) {
        //시작시간과 종료시간이 같으면 아무것도 하지 않음
        setStartTime(null);
        setEndTime(null);
        return;
      }

      if (isInBookedRange(starttime.getTime(), time)) {
        // 시작 시간과 클릭한 시간 사이에 이미 예약된 시간이 있는 경우
        toast("이미 예약된 시간이 포함되어 있습니다.");
        setStartTime(new Date(time)); // 시작 시간을 클릭한 시간으로 변경
        setEndTime(null);
        setHoverTime(null); // 추가: 마우스 오버 상태 리셋
        return;
      }

      if (time < starttime.getTime()) {
        //시작시간보다 작으면 시작시간을 변경
        setStartTime(new Date(time)); //시작시간을 선택한 시간으로 변경
        setEndTime(starttime); //종료시간을 시작시간으로 변경
      } else {
        setEndTime(new Date(time));
      }

      setHoverTime(null); // 마우스 오버 상태 리셋
    }
  }; */

  const handleTimeClick = (time: number) => {
    // 수정 중인 예약 시간의 시작과 종료 시간을 가져오기
    const editingStart = editingBooking
      ? new Date(editingBooking.starttime).getTime()
      : null;
    const editingEnd = editingBooking
      ? new Date(editingBooking.endtime).getTime()
      : null;

    // 선택된 시간이 이미 예약된 시간인지 확인하되, 수정 중인 예약시간은 예외 처리
    if (time !== editingStart && time !== editingEnd && isBooked(time)) {
      toast.error("이미 예약된 시간입니다.");
      return;
    }

    if (!starttime || (starttime && endtime)) {
      // 선택된 시간이 없거나 시작시간과 종료시간이 모두 선택된 경우
      setStartTime(new Date(time));
      setEndTime(null);
      setHoverTime(null); // 마우스 오버 상태 리셋
    } else if (starttime && !endtime) {
      // 시작시간만 선택된 경우
      if (time === starttime.getTime()) {
        // 시작시간과 종료시간이 같으면 아무것도 하지 않음
        setStartTime(null);
        setEndTime(null);
        return;
      }

      if (!editingBooking || (time !== editingStart && time !== editingEnd)) {
        if (isInBookedRange(starttime.getTime(), time, editingBooking)) {
          toast.error("이미 예약된 시간이 포함되어 있습니다.");
          return;
        }
      }

      if (time < starttime.getTime()) {
        // 클릭한 시간이 시작시간보다 작은 경우
        setStartTime(new Date(time));
        setEndTime(starttime);
      } else {
        // 클릭한 시간이 시작시간보다 크거나 같은 경우
        setEndTime(new Date(time));
      }
      setHoverTime(null); // 마우스 오버 상태 리셋
    }
  };

  const [hoverTime, setHoverTime] = useState<Date>(); // 마우스 오버 시 선택된 시간 범위 표시

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

  // 수정 중인 예약시간이 해당 시간에 포함되는지 확인하는 함수
  const isEditingTimeRange = (time: number) => {
    if (!editingBooking) {
      return false;
    }
    const editingStart = convertToLocalTime(editingBooking.starttime).getTime();
    // 종료 시간은 해당 분의 시작을 포함하므로.
    const editingEnd = convertToLocalTime(editingBooking.endtime).getTime();

    // 현재 시간이 수정 중인 예약시간의 범위 내에 있는지 확인
    return time >= editingStart && time < editingEnd;
  };

  // 날짜가 변경되면 선택된 시간 초기화
  useEffect(() => {
    setStartTime(null);
    setEndTime(null);
  }, [selectedDate]);

  // 시작시간과 종료시간이 선택되면 onTimeChange 콜백 함수를 호출하여 부모 컴포넌트로 전달
  useEffect(() => {
    if (starttime && !endtime) {
      const newEndTime = new Date(starttime.getTime() + 30 * 60 * 1000);
      onTimeChange(starttime, newEndTime);
    } else if (starttime && endtime) {
      const newEndTime = new Date(endtime.getTime() + 30 * 60 * 1000);
      if (endtime !== newEndTime) {
        onTimeChange(starttime, newEndTime);
      }
    } else {
      onTimeChange(null, null);
    }
  }, [starttime, endtime, onTimeChange]);

  return (
    <>
      <div className="grid">
        <div className="my-3 grid grid-cols-5 ">
          {times.map((time) => {
            const isSelected =
              starttime !== null &&
              endtime !== null &&
              time >= starttime &&
              time <= endtime;
            
            const isEditing = isEditingTimeRange(time);

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
                            ? "bg-gray-200 cursor-not-allowed text-gray-300"
                            : ""
                        }
                        
                        ${isEditing ? "border-red-500" : "border-gray-200"}
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
                  /* (isToday(selectedDate) && new Date(time) <= new Date()) || isBooked(time) */
                  (isToday(selectedDate) &&
                    new Date(time) <= new Date() &&
                    !isBooked(time)) ||
                  isBooked(time)

                  //(new Date(time) <= new Date()) || isBooked(time)
                }
                onClick={() => handleTimeClick(time)}
              >
                {new Date(time).getHours().toString().padStart(2, "0")}:
                {new Date(time).getMinutes() === 0 ? "00" : "30"}
                <br />
              </button>
            );
          })}
          {/* <div className="m-1 py-2 border border-gray-200 rounded text-center">20:00 까지</div> */}
        </div>
      </div>

      <div>
        시간 선택은 30분 단위 입니다.
        <br /> 예) 30분 예약시 13:00~13:30이용시 13:00 버튼만 선택해주세요.
      </div>
    </>
  );
};

export default TimePicker;
