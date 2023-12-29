"use client";

import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useRoomReserveEditModal from "@/hooks/useRoomReserveEditModal";
import RoomReserveEditModal from "../modal/RoomReserveEditModal";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import Button from "../Button";
import { useRouter } from "next/navigation";

interface DisplayBookingListProps {
  displayId: string;
  roomId?: SafeRoom;
  currentUser?: SafeUser | null;
  booking?: SafeBooking;
  edit?: boolean;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const DisplayBookingList: React.FC<DisplayBookingListProps> = ({
  displayId,
  roomId,
  currentUser,
  booking,
  edit,
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

  // /rooms 경로인지 확인합니다.
  //const isRoomPath = pathname.startsWith("/rooms");

  // 현재 시간이 예약 시간 내에 있는지 확인하는 함수
  const isCurrentlyBooked = (starttime: Date, endtime: Date) => {
    const now = new Date();
    const nowUtc = new Date(
      now.getTime() + now.getTimezoneOffset() * 60 * 1000
    );

    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );

    return now >= start && now <= end;
  };

  const isTodayBooking = (starttime: Date) => {
    const now = new Date();
    const nowUtc = new Date(
      now.getTime() + now.getTimezoneOffset() * 60 * 1000
    );

    const start = new Date(
      new Date(starttime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );

    const isToday =
      start.getDate() === now.getDate() &&
      start.getMonth() === now.getMonth() &&
      start.getFullYear() === now.getFullYear();

    return  isToday;
  }

  // 예약 시간이 지났는지 확인하는 함수
  const isPast = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return end < now;
  };

  // 예약시간 포맷팅 함수
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

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); //1분 60000, 1초 1000, 30초 30000

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const roomReserveEditModal = useRoomReserveEditModal();
  const [isOpen, setIsOpen] = useState(false);

  // 현재 편집 중인 예약을 추적하기 위한 상태
  const [editingBooking, setEditingBooking] = useState<SafeBooking | null>(null);

  // "수정하기" 버튼 클릭을 처리하는 핸들러
  const handleBookingEditClick = useCallback(
    (bookingToEdit) => {      
      setEditingBooking(bookingToEdit);
      roomReserveEditModal.onOpen();
    },
    [roomReserveEditModal]
  );

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!bookings) return <div>데이터를 불러오는 중...</div>;

  return (
    <>
      {edit && (
        <RoomReserveEditModal
          displayId={displayId}
          booking={editingBooking}
          currentUser={currentUser}
        />
      )}

      <div className="flex flex-col relative z-10 after:block after:clear-both after:relative">
        {bookings.map((booking, idx) => (
          <>
            <div
              key={booking.id}
              className="relative"
              data-idx={booking.id}
              data-date={booking.starttime}
            >
              <div
                className={`flex flex-row w-full relative p-5 rounded-lg my-1 text-slate-600 ${
                  isCurrentlyBooked(booking.starttime, booking.endtime)
                    ? "bg-amber-500 text-white"
                    : isPast(booking.endtime)
                    ? "bg-gray-200 text-slate-300"
                    : isTodayBooking(booking.starttime)
                    ? "bg-sky-200"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex-col w-3/4">
                  <div className="font-bold text-xs text-lime-700">
                    {/* {format(
                      new Date(formatDate(booking.starttime)),
                      "dd일 HH:mm"
                    )}{" "} */}
                    {formatUnit(booking.starttime)[2]}일{" "}
                    {formatTime(booking.starttime)}~{" "}
                    {formatTime(new Date(new Date(booking.endtime).getTime()+1000).toISOString())}
                    {/* {format(
                      new Date(
                        formatDate(
                          new Date(
                            new Date(booking.endtime).getTime() + 1000
                          ).toISOString()
                        )
                      ),
                      "HH:mm"
                    )}{" "} */}
                  </div>
                  <div className="text-base">{booking.topic}</div>
                  <div>
                    {booking.booking_user} 외 {booking.attendees} 명{" "}
                    {isPast(booking.endtime) ? (
                      <div className="absolute right-6">Check Out</div>
                    ) : (
                      ""
                    )}
                    {isCurrentlyBooked(booking.starttime, booking.endtime) && (
                      <div className="absolute top-2 right-6 text-white flex flex-col items-center">
                        <span>이용 중</span>
                      </div>
                    )}
                  </div>
                </div>

                
                {!isPast(booking.endtime) &&
                  !isCurrentlyBooked(booking.starttime, booking.endtime) && (
                    <div className="flex flex-col justify-end items-end text-center text-white  w-1/4">
                      {edit &&
                        (format(new Date(), "yyyy-MM-dd") ===
                        formatDateDay(booking.starttime) ? (
                          <div className="my-1 w-[100px] h-[30px] flex flex-col justify-center text-slate-600">
                            오늘 {formatUnit(booking.starttime)[3]}:
                            {formatUnit(booking.starttime)[4]}
                          </div>
                        ) : (
                          <div className="my-1 w-[100px] h-[30px] flex flex-col justify-center text-orange-600">
                            {formatUnit(booking.starttime)[1]}월
                            {formatUnit(booking.starttime)[2]}일{" "}
                            {formatUnit(booking.starttime)[3]}:
                            {formatUnit(booking.starttime)[4]}
                          </div>
                        ))}
                      {edit && (
                        <div className="w-[100px] drop-shadow-lg ml-1">
                          <Button
                            label="수정하기"
                            bgcolor={"bg-[#eb937f]"}
                            small
                            onClick={() => handleBookingEditClick(booking)}
                          />
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default DisplayBookingList;
