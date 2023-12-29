"use client";

import useSWR from "swr";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { SlClock } from "react-icons/sl";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { PiUsersThree } from "react-icons/pi";
import { TbTimeDuration10 } from "react-icons/tb";

import { format } from "date-fns";
import DateClock from "@/components/DateClock";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { SafeRoom } from "@/types";
import { duration } from "@mui/material";
import ConfirmModal from "@/components/modal/ConfirmModal";
import useConfirmModal from "@/hooks/useConfirmModal";
import { start } from "repl";

interface DisplayClient2Props {
  displayId?: string;
  roomInfo?: SafeRoom;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const DisplayClient2: React.FC<DisplayClient2Props> = ({
  displayId,
  roomInfo,
}) => {
  /**
   * DisplayClient2 컴포넌트에서 사용하는 useSWR 훅을 이용해 displayId에 해당하는 예약 정보를 가져옴
   * 1초마다 가지고 옴
   * @param {string} displayId - 가져올 예약 정보의 회의실ID
   * @returns {Object} - 예약 정보와 에러 객체를 담은 객체
   */
  const { data: bookings = [], error } = useSWR(
    displayId ? `/api/displays/${displayId}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: false }
  );

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

  const isNextBooking = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return now < end;
  };

  const isPast = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return end < now;
  };

  const isChecked = (starttime: Date) => {
    const now = new Date();
    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return start > now;
  };

  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(false);

  // 현재 예약 중인 항목을 찾기
  const currentBooking = bookings?.find((booking) =>
    isCurrentlyBooked(booking.starttime, booking.endtime)
  );

  const nextBooking = bookings?.find((booking) =>
    isNextBooking(booking.endtime)
  );

  // 현재시간 이전항목 에서 booking.checkin==="Y" 인 항목을 찾기
  

  const pastBooking = bookings?.find((booking) => isPast(booking.endtime));

  // 체크인 상태인 항목을 찾기
  const checkedInBooking = bookings?.find((booking) => booking.checkin === "Y");
  /* 

  const onCheckInBooking = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: currentBooking.id,
        checkin: "Y",
      })
      .then(() => {
        //toast.success("체크인 되었습니다!");
        setIsCheckIn(true);
        toast.custom((t) => (
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
        ));

        router.refresh();
      })
      .catch(() => {
        toast.error("실패");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentBooking, setIsCheckIn, router]);

  const onCheckOutBooking = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/displays", {
        bookingId: currentBooking.id,
        checkin: "N",
        endtime: new Date().getTime() + 1000 * 60 * 60 * 9,
      })
      .then(() => {
        setIsCheckIn(false);
        toast.success("체크 아웃 되었습니다!", { duration: 1000 });
        router.refresh();
      })
      .catch(() => {
        toast.error("실패");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentBooking, setIsCheckIn, router]);

  const onAddTimeBooking = useCallback(() => {
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

 */
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

  const timezoneOffset = new Date().getTimezoneOffset() * 60000;

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

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!bookings) return <div>데이터를 불러오는 중...</div>;

  const onCheckInBooking = () => {
    setIsCheckIn(true);
  };

  const onCheckOutBooking = () => {
    setIsCheckIn(false);
  };
  // bookings 에서 booking.checkin === "Y" 인 항목 찾기 함수 작성

  // 1. 현재 시간에 해당되는 회의가 있을때 해당 회의를 노출, 체크인 버튼 노출
  // 2. 현재 진행중 시간이고 체크인을 했을때 체크아웃 버튼 노출
  // 3. 체크인 후 종료 시간이 지나고 다음 예약이 현재 일정과 겹칠때 체크아웃 안한 회의가 계속 노출되고
  // 4. 체크아웃 안한 회의가 없을때 다음 예약이 있으면 다음 예약을 노출
  // 5. 다음 예약이 없으면 예약이 없다고 노출

  return (
    <>
      { checkedInBooking && !currentBooking ? (
      <div>
        <h2>체크아웃 안한 회의</h2>
        <p>주제: {checkedInBooking.topic}</p>

        <p>
          어멋! 시간이 지났네? 체크 아웃좀 하지? 다음 이용자가 이용을 못하고
          있잖아
        </p>

        {/* Checkin 상태에 따라 버튼을 다르게 표시 */}

        <Button
          onClick={onCheckOutBooking}
          label="체크아웃"
          icon={AiOutlineCheckCircle}
        />
      </div>
      ): (
        currentBooking ? (
          <div>
            {/* Checkin 상태에 따라 버튼을 다르게 표시 */}
            <h2>현재 진행중인 회의</h2>
            <p>주제: {checkedInBooking.topic}</p>
            <p>체크아웃 해랏</p>
          </div>
        ) : nextBooking ? (
          <div>
            <h2>다음 예약</h2>
            <p>주제: {nextBooking.topic}</p>
          </div>
        ) : (
          <div>예약이 없습니다.</div>
        )
      )}
    </>
  );
};

export default DisplayClient2;

//위 전체 코드에서 현재 진행 중인 회의가 있을때 현재 회의를 표시 하고 체크인을 하지 않았을때 체크인 버튼을 표시하고 체크인을 했을때 체크아웃 버튼을 표시 체크아웃을 하지 않으면 시간이 지나도 핸재 상태 그대로 유지 하며 체크 아웃을 해야 다음 상태로 넘어가는 코드를 작성 해줘 체크인, 체크아웃 기준은 currentBooking.checkin === "Y" 이거로 하면 될거 같아요
