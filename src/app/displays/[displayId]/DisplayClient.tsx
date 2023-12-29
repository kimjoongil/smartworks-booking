"use client";

import useSWR from "swr";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import {SlClock} from "react-icons/sl";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { PiUsersThree } from "react-icons/pi";
import { TbTimeDuration10 } from "react-icons/tb";

import { format } from "date-fns";
import DateClock from "@/components/DateClock";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import { duration } from "@mui/material";
import ConfirmModal from "@/components/modal/ConfirmModal";
import useConfirmModal from "@/hooks/useConfirmModal";
import useDisplayReserveModal from "@/hooks/useDisplayReserveModal";
import DisplayReserveModal from "@/components/modal/DisplayReserveModal";
//import useAutoRefresh from "@/hooks/useAutoRefresh";
import DateTimeClock from "@/components/DateTimeClock";
import DateClock2 from "@/components/DateClock2";

interface DisplayClientProps {
  displayId?: string;
  Bookings?: SafeBooking;
  roomInfo?: SafeRoom;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const DisplayClient: React.FC<DisplayClientProps> = ({
  displayId,
  Bookings,
  roomInfo,
}) => {
  /**
   * DisplayClient 컴포넌트에서 사용하는 useSWR 훅을 이용해 displayId에 해당하는 예약 정보를 가져옴
   * 1초마다 가지고 옴
   * @param {string} displayId - 가져올 예약 정보의 회의실ID
   * @returns {Object} - 예약 정보와 에러 객체를 담은 객체
   */
  const { data: bookings = [], error } = useSWR(
    displayId ? `/api/displays/${displayId}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: false }
  );

  const router = useRouter();
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const displayReserveModal = useDisplayReserveModal();
  const [isOpen, setIsOpen] = useState(false);

  const isCurrentlyBooked = (starttime: Date, endtime: Date) => {
    const now = new Date();

    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );

    return now >= start && now <= end;
  };

  /**
   * 해당 시간이 현재 시간보다 이후면서 오늘만 인지 여부를 반환합니다.
   * @param endtime - 비교할 시간입니다.
   * @returns {boolean} - 현재 시간보다 이후인 경우 true, 그렇지 않은 경우 false를 반환합니다.
   */
  const isNextBooking = (endtime: Date) => {
    /* const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return now < end; */

    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    const isToday =
      end.getDate() === now.getDate() &&
      end.getMonth() === now.getMonth() &&
      end.getFullYear() === now.getFullYear();
    return now < end && isToday;
  };

  const isPast = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return end < now;
  };

  const isPrevBooking = (starttime: Date, endtime: Date) => {
    const now = new Date();
    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return start < now && now < end;
  };

  const isChecked = (starttime: Date, endtime: Date) => {
    const now = new Date();
    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return now > start && now < end;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // 현재 예약 중인 항목을 찾기
  const currentBooking = bookings?.find((booking) =>
    isCurrentlyBooked(booking.starttime, booking.endtime)
  );

  
  const nextBooking = bookings?.find((booking) =>
    isNextBooking(booking.endtime)
  );

  const prevBooking = bookings?.find((booking) =>
    isPrevBooking(booking.starttime, booking.endtime)
  );

  // 체크인 상태인 항목을 찾기
  const checkedInBooking = bookings?.find((booking) => booking.checkin === "Y");
  const currentCheckedInBooking = bookings?.find((booking) =>
    isChecked(booking.starttime, booking.endtime)
  );
  const pastBooking = bookings?.find((booking) => isPast(booking.endtime));

  const onCheckInBooking = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: currentBooking.id,
        checkin: "Y",
      })
      .then(() => {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5"></div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      회의를 시작하겠습니다. <br /> 체크인 되었습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  OK
                </button>
              </div>
            </div>
          ),
          { duration: 1000 }
        );
        router.refresh();
      })
      .catch((error) => {
        if (error.response) {
          const message = error.response.data.message || error.message;
          toast.error(message);
        } else {
          // 서버로부터 오류 메시지를 받지 못했을 경우
          toast.error("예약 수정 중 오류가 발생했습니다. ");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentBooking, router]);

  const onCheckOutBooking = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: checkedInBooking ? checkedInBooking.id : currentBooking.id,
        checkin: "N",
        endtime: currentBooking
          ? new Date().getTime() + 1000 * 60 * 60 * 9
          : /* checkedInBooking ? checkedInBooking.endtime : */ currentBooking.endtime,
      })
      .then(() => {
        toast.success("체크 아웃 되었습니다!", { duration: 1000 });
        router.refresh();
      })
      .catch(() => {
        toast.error("실패");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentBooking, checkedInBooking, router]);

  const onBookingEarlyClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: nextBooking.id,
        checkin: "Y",
        starttime: new Date().getTime() + 1000 * 60 * 60 * 9,
      })
      .then(() => {
        toast.success("바로 시작 되었습니다.", { duration: 1000 });
        router.refresh();
      })
      .catch(() => {
        toast.error("실패");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [nextBooking, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); //1분 60000, 1초 1000, 30초 30000

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // 현재 예약 상태를 다시 계산
    const nextBooking = bookings?.find((booking) =>
      isCurrentlyBooked(booking.starttime, booking.endtime)
    );
    // 만약 필요하다면, 다른 상태를 업데이트하여 화면에 반영
  }, [nextDate, bookings]);

  useEffect(() => {
    // 현재 예약 상태를 다시 계산
    const nextBooking = bookings?.find((nextbooking) =>
      isNextBooking(nextbooking.endtime)
    );
    // 만약 필요하다면, 다른 상태를 업데이트하여 화면에 반영
  }, [currentDate, bookings]);

/*   useAutoRefresh([
    { hours: 17, minutes: 0 }, // 오후 12:00
  ]); */

  const formatRemainingTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0");
    const day = String(date.getUTCDate()).toString().padStart(2, "0");
    const hours = String(date.getUTCHours()).toString().padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).toString().padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).toString().padStart(2, "0");

    return `${month}.${day} ${hours}:${minutes}`;
  };

  const formatDateDay = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0");
    const day = String(date.getUTCDate()).toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).toString().padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
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

  //현재 진행중 회의에 checkin이 안되어있으면 시작시간으로 부터 얼마나 짔는지 계산 시간
  const currentRemainingTime =
    currentBooking &&
    currentBooking.checkin === "N" &&
    currentDate.getTime() -
      new Date(
        new Date(currentBooking.starttime).getTime() + timezoneOffset
      ).getTime();

  //다음시간 예약 시간 까지 남은 시간
  const nextRemainingTime =
    nextBooking &&
    new Date(
      new Date(nextBooking.starttime).getTime() + timezoneOffset
    ).getTime() - currentDate.getTime();

  const isAddable = currentBooking && nextBooking && new Date(new Date(currentBooking.endtime).getTime() + timezoneOffset).getTime() + 10 * 60 * 1000 <= new Date(new Date(nextBooking.starttime).getTime() + timezoneOffset).getTime();

  const totalTime = currentBooking
    ? new Date(
        new Date(currentBooking.endtime).getTime() + timezoneOffset
      ).getTime() -
      new Date(
        new Date(currentBooking.starttime).getTime() + timezoneOffset
      ).getTime()
    : 1;

  const remainingTime = currentBooking
    ? new Date(
        new Date(currentBooking.endtime).getTime() + timezoneOffset
      ).getTime() - currentDate.getTime()
    : 0;

  const progressBarPercentage = (1 - remainingTime / totalTime) * 100;

  const [modalKey, setModalKey] = useState(Date.now());

  const handleBookingClick = useCallback(() => {
    setIsOpen(false);
    setModalKey(Date.now());
    //router.refresh();
    displayReserveModal.onOpen();
  }, [displayReserveModal]);

  const onAddTimeBooking = useCallback(() => {
    
    //console.log(nextBooking.topic)
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: currentBooking.id,
        checkin: "Y",
        endtime: new Date(currentBooking.endtime).getTime() + 10 * 60 * 1000,
      })
      .then(() => {
        toast.success("10분 추가되었습니다.", { duration: 1000 });
        router.refresh();
      })
      .catch(() => {
        toast.error("실패");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentBooking, router]);

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!bookings) return <div>데이터를 불러오는 중...</div>;

  return (
    <>
      <div className="flex flex-col p-2 sm:p-10 relative max-w-[800px] mx-auto z-10 bg-[#0E1628] text-white h-screen after:block after:clear-both after:relative">
        <div
          id="roomState"
          className="flex flex-col text-white h-screen p-5 sm:p-10 rounded-2xl overflow-hidden border border-white"
        >
          <div className="flex-col flex-shrink-0">
            <div className="flex flex-row justify-between text-white w-full py-5 z-20">
              <div className="flex w-2/5">
                <Image
                  src="/images/asone_logo_white.svg"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  alt={"ASONE"}
                />
              </div>
              <DateClock2 />
            </div>

            <h2 className="mb-5 sm:mb-10 py-2 text-2xl sm:text-4xl text-[#9F9F9F]">
              <strong>{roomInfo.roomname}</strong>
            </h2>
          </div>

          <DisplayReserveModal
            key={modalKey}
            displayId={displayId}
            roomId={roomInfo}
            booking={bookings}
          />

          {/* {checkedInBooking && pastBooking && (
            <>
              <div className="flex flex-col justify-between grow">
                <div className="flex flex-col min-h-[250px] sm:min-h-[350px] p-5 sm:p-10 rounded-tr-3xl rounded-br-3xl bg-[rgba(38,46,62,1)]">
                  <div
                    className={`text-3xl sm:text-5xl font-semibold py-3 sm:py-6
                    ${checkedInBooking.checkin === "N" ? "text-white" : ""}
                    ${
                      checkedInBooking.checkin === "Y"
                        ? "text-white drop-shadow-lg"
                        : ""
                    }
                  `}
                  >
                    {checkedInBooking.topic}
                  </div>
                  <div className="flex flex-row text-2xl font-thin align-middle">
                    <div className="font-light text-[#9F9F9F] leading-10">
                      {formatTime(checkedInBooking.starttime)} ~{" "}
                      {formatTime(
                        new Date(
                          new Date(checkedInBooking.endtime).getTime() + 1000
                        ).toISOString()
                      )}
                      <br />
                      {checkedInBooking.booking_user} 외{" "}
                      {checkedInBooking.attendees} 명
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <div className="bg-gray-300 h-5 rounded-md overflow-hidden relative">
                      <div
                        style={{ width: `${100}%` }}
                        className="bg-[#e4704e] h-full rounded-md absolute left-0"
                      ></div>
                    </div>
                    <div className="flex text-base justify-end">
                      남은 시간 : 00:00:00
                    </div>
                  </div>

                </div>

                <div className="flex flex-col w-full mt-20 text-3xl">
                  <div className="w-full text-center text-sm sm:text-2x1 pb-5 animate-bounce text-yellow-400 animateText">
                    이전 회의가 길어 지고 있습니다. 잠시만 기다려주세요.
                    <br />
                    회의가 끝났다면 체크아웃 버튼을 눌러주세요.
                  </div>
                  <div className="w-full text-center text-2x1 pb-5"></div>
                  <Button
                    label="체크아웃"
                    onClick={onCheckOutBooking}
                    icon={AiOutlineCheckCircle}
                  />
                </div>
              </div>
            </>
          )} */}
          {currentBooking ? (
            <>
              <div className="flex flex-col justify-between grow">
                <div className="flex flex-col min-h-[250px] sm:min-h-[350px] p-5 sm:p-10 rounded-tr-3xl rounded-br-3xl bg-[rgba(38,46,62,1)]">
                  <div
                    className={`text-3xl sm:text-5xl font-semibold py-3 sm:py-6
                    ${currentBooking.checkin === "N" ? "text-white" : ""}
                    ${
                      currentBooking.checkin === "Y"
                        ? "text-white drop-shadow-lg"
                        : ""
                    }
                  `}
                  >
                    {currentBooking.topic}
                  </div>
                  <div className="flex flex-row text-2xl font-thin align-middle">
                    <div className="font-light text-[#9F9F9F] leading-10">
                      {formatTime(currentBooking.starttime)} ~{" "}
                      {formatTime(
                        new Date(
                          new Date(currentBooking.endtime).getTime() + 1000
                        ).toISOString()
                      )}
                      <br />
                      {currentBooking.booking_user} 외{" "}
                      {currentBooking.attendees} 명
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <div className="bg-gray-300 h-5 rounded-md overflow-hidden relative">
                      <div
                        style={{ width: `${progressBarPercentage}%` }}
                        className="bg-[#e4704e] h-full rounded-md absolute left-0"
                      ></div>
                    </div>
                    <div className="flex text-base justify-end">
                      남은 시간 : {formatRemainingTime(remainingTime)}
                    </div>
                  </div>
                </div>

                {currentBooking.checkin === "N" ? (
                  <div className="flex flex-col w-full mt-20 text-3xl">
                    <div className="w-full text-center text-sm sm:text-2x1 pb-5 animate-bounce text-yellow-400 animateText">
                      이용 시작 {formatRemainingTime(currentRemainingTime)} 이
                      지났습니다.
                      <br />
                      체크인 버튼을 눌러주세요
                    </div>

                    <Button
                      label="체크인"
                      onClick={onCheckInBooking}
                      bgcolor="bg-[#e4704e]"
                    />
                  </div>
                ) : currentBooking.checkin === "Y" ? (
                  <>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row w-full mt-20 text-3xl gap-5">
                        <Button
                          label="체크아웃"
                          onClick={onCheckOutBooking}
                          bgcolor={"bg-[#e4704e]"}
                        />
                        <Button
                          label="시간연장"
                          onClick={onAddTimeBooking}
                          bgcolor={"bg-[#82211F]"}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row w-full mt-20 text-3xl gap-5">
                        <Button
                          label="체크아웃"
                          onClick={onCheckOutBooking}
                          bgcolor={"bg-[#e4704e]"}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : nextBooking ? (
            <>
              <div className="flex flex-col justify-between grow">
                <div className="flex flex-row min-h-[250px] sm:min-h-[350px] rounded-tr-3xl rounded-br-3xl p-5 sm:p-10 bg-[rgba(255,255,255,0.1)] relative">
                  <div className="flex w-[10px] bg-[#E4704E] rounded-[3px]"></div>
                  <div className="flex flex-col ml-5">
                    <div className="text-3xl sm:text-5xl font-semibold py-6">
                      {nextBooking.topic}
                    </div>
                    <div className="flex flex-row text-2xl font-thin align-middle">
                      <div className="font-light text-[#9F9F9F] leading-10">
                        {formatTime(nextBooking.starttime)} ~{" "}
                        {formatTime(
                          new Date(
                            new Date(nextBooking.endtime).getTime() + 1000
                          ).toISOString()
                        )}
                        <br />
                        {nextBooking.booking_user} 외 {nextBooking.attendees} 명
                      </div>
                    </div>
                    <div className="absolute right-5 bottom-5">
                      <Button
                        label="바로체크인"
                        onClick={onBookingEarlyClick}
                        bgcolor={"bg-[#e4704e]"}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative mt-4">
                  <div className="flex text-base justify-end"></div>
                </div>

                <div className="flex flex-col w-full mt-20 text-3xl">
                  <div className="w-full text-center text-2x1 pb-5">
                    다음 회의까지 {formatRemainingTime(nextRemainingTime)}{" "}
                    남았습니다.
                  </div>
                  <Button
                    label="새로운 회의"
                    onClick={handleBookingClick}
                    bgcolor={"bg-[#eb937f]"}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-between grow">
                <div className="flex flex-col min-h-[350px] items-center justify-center align-middle rounded-tr-3xl rounded-br-3xl p-10 bg-[rgba(255,255,255,0.1)]">
                  <div className="text-[#E4704E] text-lg text-center">
                    오늘 회의 일정이 없습니다.
                    <br />
                    회의실 이용시 먼저 예약등록을 해주세요.
                  </div>
                </div>
                <div className="flex flex-col w-full mt-20 text-3xl">
                  <Button
                    label="새로운 회의"
                    onClick={handleBookingClick}
                    bgcolor={"bg-[#eb937f]"}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayClient;
