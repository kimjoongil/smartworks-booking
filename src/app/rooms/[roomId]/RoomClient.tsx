"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

import DateTimeClock from "@/components/DateTimeClock";
import Button from "@/components/Button";

import { SafeBooking, SafeRoom, SafeUser} from "@/types";
import useRoomReserveModal from "@/hooks/useRoomReserveModal";
import RoomReserveModal from "@/components/modal/RoomReserveModal";
import DisplayBookingList from "@/components/rooms/DisplayBookinList";

interface RoomClientProps {
  roomId: SafeRoom;
  roomBookings?: SafeBooking;
  currentUser?: SafeUser | null;
}

const RoomClient: React.FC<RoomClientProps> = ({
  roomId,
  roomBookings,
  currentUser,
}) => {
  
  const roomReserveModal = useRoomReserveModal();
  const [isOpen, setIsOpen] = useState(false);

  const handleBookingClick = useCallback(() => {
    // console.log("예약하기 클릭");
    setIsOpen(false);
    //loginModal.onOpen();
    roomReserveModal.onOpen();
  }, [roomReserveModal]);

  /* const { data: refreshedBooking } = useSWR(
    `/api/bookings/${roomId.id}`,
    {
      refreshInterval: 5000,
    }
  ); */
  return (
    <>
      <RoomReserveModal
        roomId={roomId}
        roomBooking={roomBookings}
        currentUser={currentUser}
      />
      <div className="flex flex-col p-5 relative">
        <div className="relative">
          <div
            className="
          w-full
          h-[20vh]
          max-h-[20vh]
          
          overflow-hidden 
          rounded-xl
          relative
          mb-2

          sm:h-[30vh]
          sm:max-h-[30vh]
        "
          >
            <Image
              src={roomId.roometc ?? ""}
              fill
              className="object-cover w-full"
              alt="Image"
            />
          </div>
          <div className="absolute top-0 right-0 left-0 bottom-0 flex w-full h-full justify-center items-center">
            <div className="rounded-2xl bg-slate-200 opacity-80 p-5 text-center">
              <DateTimeClock />
            </div>
          </div>
        </div>

        <div className="gap-2">
          <Button
            label="예약하기"
            onClick={handleBookingClick}
            bgcolor={"bg-[#e4704e]"}
            icon={AiOutlineClockCircle}
          />
        </div>

        <div className="text-2xl font-bold my-4 text-center lg: lg:text-3xl">
          {roomId.roomname} 입니다.
        </div>
        <div className="text-lg border-[1px] p-5">
          {roomId.roomdesc} <br />
          {roomId.capacity}명 까지 가능합니다.
        </div>

        <h3 className="mt-10 font-bold text-2xl">예약 현황</h3>
        {/* {refreshedBooking?.map((booking) => {
          return <RoomBooking booking={booking} key={booking.id} />;
        })} */}

        <DisplayBookingList
          displayId={roomId.id.toString()}
          currentUser={currentUser}
          edit={true}
        />
      </div>
    </>
  );
};

export default RoomClient;
