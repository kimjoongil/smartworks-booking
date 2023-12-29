"use client";

import axios from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import useRoomReserveEditModal from "@/hooks/useRoomReserveEditModal";
import Input from "../inputs/Input";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Counter from "../inputs/Counter";
import TimePicker from "../inputs/TimePicker";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface RoomReserveEditModalProps {
  displayId: string;
  booking: SafeBooking;
  currentUser?: SafeUser | null;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const RoomReserveEditModal = ({
  displayId,
  booking,
  currentUser,
}) => {
  const { data: roomBooking, error } = useSWR(
    displayId ? `/api/rooms/${displayId}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: false }
  );

  const roomReserveEditModal = useRoomReserveEditModal();
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

  const [editingBooking, setEditingBooking] = useState(booking);
  // 수정 전 예약된 날짜와 시간을 저장할 상태를 추가합니다.
  const [bookingTime, setBookingTime] = useState("");

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

  const filteredBookings =
    roomBooking?.filter((b) => {
      //const bookingDate = new Date(b.starttime);
      const [year, month, day] = b.starttime
        .split("T")[0]
        .split("-")
        .map(Number);
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
    reset, // added reset function
  } = useForm<FieldValues>({
    defaultValues: {
      roomId: displayId,
      userId: currentUser?.id,
      user_email: currentUser?.email,
      starttime: starttime,
      endtime: endtime,
      attendees: 1,
      topic: "",
      booking_user: currentUser?.name,
      booking_pwd: "",
    },
  });

  const attendees = watch("attendees");
  const times = watch("times");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const convertToLocalTime = (utcDate: string) => {
    const date = new Date(utcDate);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  };

  useEffect(() => {
    // booking 객체가 있으면 폼 값을 업데이트
    if (booking) {
      const startDateTime = new Date(convertToLocalTime(booking.starttime));
      const endDateTime = new Date(convertToLocalTime(booking.endtime));

      // 날짜와 시간 상태 업데이트
      setSelectedDate(startDateTime);
      setStartTime(startDateTime);
      setEndTime(endDateTime);

      // booking 객체가 변경될 때마다 수정 중인 예약 정보를 업데이트
      setEditingBooking(booking);

      // 폼 필드를 업데이트
      reset({
        id: booking.id,
        roomId: booking.roomId,
        userId: currentUser?.id,
        user_email: currentUser?.email,
        topic: booking.topic,
        attendees: booking.attendees,
        booking_user: booking.booking_user,
        booking_pwd: "", // 비밀번호는 빈 문자열로 설정하거나 booking 객체의 값을 사용
        starttime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        endtime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      });

      // 수정 전 예약된 날짜와 시간을 상태에 저장합니다.
      const formattedStartTime = format(startDateTime, "yyyy년 MM월 dd일 HH:mm");
      const formattedEndTime = format((endDateTime), "HH:mm");
      setBookingTime(`예약시간: ${formattedStartTime} 부터 ${formattedEndTime}까지`);
    }
  }, [booking, currentUser, reset]);

  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //console.log(data); // 이 로그를 통해 실제로 데이터가 폼에서 전달되고 있는지 확인하세요.
    // 나머지 axios.pat
    setIsLoading(true);
    axios
      .patch(`/api/booking/${data.id}`, data) // 'PATCH' 메서드를 사용하고, 실제 예약 ID를 URL에 포함합니다.
      .then(() => {
        roomReserveEditModal.onClose();
        toast.success("예약 수정이 완료되었습니다.", { duration: 1000 });
        reset();

        setSelectedDate(new Date()); // 날짜를 오늘로 재설정합니다.
        setStartTime(undefined); // 시작 시간을 초기화합니다.
        setEndTime(undefined); // 종료 시간을 초기화합니다.

        router.refresh(); // 페이지를 새로 고침합니다.
      })
      .catch((error) => {
        // 오류 처리
        if (error.response) {
          // 서버로부터 오류 메시지를 받았을 경우
          const message = error.response.data.message || error.message;
          toast.error(message);
        } else {
          // 서버로부터 오류 메시지를 받지 못했을 경우
          toast.error("예약 수정 중 오류가 발생했습니다.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {/* //roomtbl에서 가져온 회의실 목록을 select로 보여줌 */}
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
      <div id="bookingtiem">{bookingTime}</div>
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
          editingBooking={editingBooking}
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
        예약 등록시 비밀번호를 정확히 입력해 주세요.
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
      isOpen={roomReserveEditModal.isOpen}
      title="예약 수정"
      actionLabel="수정하기"
      onClose={roomReserveEditModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default RoomReserveEditModal;
