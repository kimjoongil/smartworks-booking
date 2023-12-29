"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import Button from "../Button";
import DisplayBookingList from "./DisplayBookinList";

interface RoomListCardProps {
  data: SafeRoom;
  booking?: SafeBooking;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const RoomListCard: React.FC<RoomListCardProps> = ({
  data,
  booking,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const reservationDate = useMemo(() => {
    if (!booking) {
      return null;
    }

    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const start = new Date(booking.starttime).getTime() + timezoneOffset;
    const end = new Date(booking.endtime).getTime() + timezoneOffset;

    return `${format(start, "[yy.MM.dd] HH:mm")} ~ ${format(end, "HH:mm")}`;
  }, [booking]);

  // 예약 시간이 지났는지 확인하는 함수
  const isPast = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return end < now;
  };

  return (
    <div className="col-span-1 relative bg-white">
      <div className="rounded-lg overflow-hidden group cursor-pointer hover:shadow-2xl hover:transition-shadow group-hover:scale-110">
        <div
          onClick={(id) => router.push(`/rooms/${data.id}`)}
          className={`w-full relative overflow-hidden rounded-xl
          ${onAction && actionLabel ? "h-[130px]" : "aspect-square"}`}
        >
          <Image
            fill
            className="object-cover h-full w-full "
            src={data.roomimg}
            alt={data.roomname}
          />
          {onAction && actionLabel ? (
            <div className="absolute z-10 bottom-0 w-full bg-[rgba(255,255,255,0.7)] p-4 text-center font-serif text-2xl">
              {data.roomname}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {!onAction && actionLabel && (
        <div className="w-full">
          <div className="w-full text-center text-base md:text-lg sm:text-4xl my-2">
            {data.roomname}
          </div>
        </div>
      )}

      {onAction && actionLabel ? (
        <>
          <div className="w-full text-center text-base font-semibold">
            {booking.topic}
            <br />
            <div className="text-xs">{reservationDate}</div>
          </div>
          {!isPast(new Date(booking.endtime)) && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}
        </>
      ) : (
        <>
          <DisplayBookingList displayId={data.id.toString()} />
        </>
      )}
    </div>
  );
};

export default RoomListCard;
