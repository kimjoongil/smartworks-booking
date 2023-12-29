"use client";

import axios from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import useRoomReserveModal from "@/hooks/useRoomReserveModal";
import Input from "../inputs/Input";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Counter from "../inputs/Counter";
import TimePicker from "../inputs/TimePicker";
import { useRouter } from "next/navigation";
import { format, set } from "date-fns";

interface RoomReserveModalProps {
  roomId: SafeRoom;
  roomBooking?: SafeBooking;
  currentUser?: SafeUser | null;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const RoomReserveModal = ({
  roomId,
  roomBooking,
  currentUser,
}) => {

  const { data: roomBookingState, error } = useSWR(
    roomId ? `/api/rooms/${roomId.id}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: false }
  );

  const roomReserveModal = useRoomReserveModal();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date()); // 기본값으로 오늘 날짜를 선택
  const [starttime, setStartTime] = useState<Date>();
  const [endtime, setEndTime] = useState<Date>();

  const handleDateSelect = (date: Date | null) => {
    setStartTime(undefined); // 시작 시간을 초기화합니다.
    setEndTime(undefined); // 종료 시간을 초기화합니다.

    if (!date) {
      // 만약 date가 null이면 기본값 (오늘 날짜)로 설정하거나 다른 로직을 추가
      setSelectedDate(new Date());
      return;
    }
    if (selectedDate.getTime() !== date.getTime()) {
      setSelectedDate(date);
      setStartTime(undefined); // 시작 시간을 초기화합니다.
      setEndTime(undefined); // 종료 시간을 초기화합니다.
    }
  };

  const handleTimeChange = (newStartTime: Date, newEndTime: Date | null) => {
    

    if (!newStartTime) {
      setStartTime(undefined);
      setEndTime(undefined);
      return; // 시작 시간이 없는 경우 함수 종료
    }

    if (
      newStartTime &&
      (!starttime || newStartTime.getTime() !== starttime.getTime())
    ) {
      setStartTime(newStartTime);
      setValue("starttime", formatDateWithTime(selectedDate, newStartTime));
    }

    if (!newEndTime) {
      newEndTime = new Date(
        newStartTime.getTime() + 29 * 60 * 1000 + 59 * 1000
      );
    }

    if (
      newEndTime &&
      (!endtime || newEndTime.getTime() !== endtime.getTime())
    ) {
      setEndTime(newEndTime);
      setValue(
        "endtime",
        formatDateWithTime(selectedDate, new Date(newEndTime.getTime() - 1000))
      );
    }
  };

  const filteredBookings = roomBookingState?.filter((b) => {
    //const bookingDate = new Date(b.starttime);
    const [year, month, day] = b.starttime.split("T")[0].split("-").map(Number);
    const bookingDate = new Date(year, month - 1, day); // Remember months are 0-indexed

    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  }) || [];


  const dateClass = (date: Date) => {
    return selectedDate?.getTime() === date.getTime()
      ? "bg-blue-100 text-white"
      : "";
  };

  const formatDateWithTime = (date: Date | null, time: Date | null): string => {
    if (!date || !time) return "";

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // ISO-8601 형식으로 반환
    return `${formattedDate}T${time
      .getHours()
      .toString()
      .padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time
      .getSeconds()
      .toString()
      .padStart(2, "0")}.000Z`;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset, // add reset function
  } = useForm<FieldValues>({
    defaultValues: {
      roomId: roomId.id,
      userId: currentUser ? currentUser.id : null,
      user_email: currentUser ? currentUser.email : null,
      starttime: starttime,
      endtime: endtime,
      attendees: 1,
      topic: "",
      booking_user: currentUser ? currentUser.name : null,
      booking_pwd: "",
    },
  });

  const attendees = watch("attendees");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!starttime) {
      toast.error("시작 시간을 선택해주세요");
      return;
    }

    // endtime이 없을 경우, starttime에 29분 59초를 더한다.
    if (!endtime) {
      const newEndTime = new Date(
        starttime.getTime() + 29 * 60 * 1000 + 59 * 1000
      );
      setEndTime(newEndTime);
      setValue("endtime", formatDateWithTime(selectedDate, newEndTime));
    }

    setIsLoading(true);
    axios
      .post("/api/booking", data)
      .then(() => {
        roomReserveModal.onClose();
        toast.success("예약이 완료되었습니다.");
        reset();

        setSelectedDate(new Date()); // 날짜를 오늘로 재설정합니다.
        setStartTime(undefined); // 시작 시간을 초기화합니다.
        setEndTime(undefined); // 종료 시간을 초기화합니다.

        router.refresh();
      })
      .catch((error) => {
        // 서버로부터의 오류 메시지 확인
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("중복된 예약 시간이 있습니다.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // 마우스 오른쪽 클릭 방지
    const handleRightClick = (event) => event.preventDefault();
    // 텍스트 선택 방지 (옵션)
    const handleSelection = (event) => event.preventDefault();

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("selectstart", handleSelection); // 드래그를 통한 선택 방지

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("selectstart", handleSelection);
    };
  }, []);
  
  const bodyContent = (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {/* //roomtbl에서 가져온 회의실 목록을 select로 보여줌 */}
      <div className="text-sm sm:text-2xl">
        <strong>{roomId.roomname}</strong> 입니다.
      </div>
      <Input
        id="topic"
        label="회의 주제"
        disabled={isLoading}
        numOnly={false}
        register={register}
        errors={errors}
        required
        autocomplete="off"
      />

      <div className="flex flex-row w-full justify-between">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => {
            handleDateSelect(date);
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
        {starttime && (
          <div className="flex flex-col h-full align-middle">
            <div className="align-middle h-full text-right">
              {format(selectedDate, "yyyy년 MM월 dd일")}
            </div>
            <div className="align-middle text-base h-full font-semibold text-right">
              {`${starttime.getHours().toString().padStart(2, "0")}:${
                starttime.getMinutes() === 0 ? "00" : "30"
              } ~ `}
              {endtime
                ? `${endtime.getHours().toString().padStart(2, "0")}:${
                    endtime.getMinutes() === 0 ? "00" : "30"
                  }`
                : `${new Date(starttime.getTime() + 30 * 60 * 1000)
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${
                    new Date(
                      starttime.getTime() + 30 * 60 * 1000
                    ).getMinutes() === 0
                      ? "00"
                      : "30"
                  }`}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        <TimePicker
          selectedDate={selectedDate}
          onTimeChange={handleTimeChange}
          bookedTimes={filteredBookings}
        />
      </div>
      <div className="flex justify-between flex-row items-center">
        <div className="flex flex-row items-center">
          <div className="flex w-4/5">
            <Input
              id="booking_user"
              label="예약자 성함"
              disabled={isLoading}
              numOnly={false}
              register={register}
              errors={errors}
              required
              autocomplete="off"
            />
          </div>
          <div className="flex flex-col ml-2">외</div>
        </div>
        <div>
          <Counter
            onChange={(value) => setCustomValue("attendees", value)}
            value={attendees}
            title="추가 인원"
            subtitle=""
          />
        </div>
      </div>
      <div>
        <Input
          id="booking_pwd"
          label="예약 비밀번호 (숫자 4자리)"
          disabled={isLoading}
          numOnly={true}
          type="password"
          register={register}
          errors={errors}
          required
          autocomplete="off"
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={roomReserveModal.isOpen}
      title="회의실 예약"
      actionLabel="예약하기"
      onClose={roomReserveModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default RoomReserveModal;
