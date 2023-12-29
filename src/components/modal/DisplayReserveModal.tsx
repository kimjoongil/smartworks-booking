"use client";

import axios from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import useDisplayReserveModal from "@/hooks/useDisplayReserveModal";
import Input from "../inputs/Input";
import { SafeBooking, SafeRoom, SafeUser } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Counter from "../inputs/Counter";
import TimePicker from "../inputs/TimePicker";
import { useRouter } from "next/navigation";
import { format, set, addMinutes, addHours, setMinutes, max } from "date-fns";
import TimeCounter from "../inputs/TimeCounter";
import { start } from "repl";
import { el } from "date-fns/locale";


interface DisplayReserveModalProps {
  displayId: string;
  booking?: SafeBooking;
  roomId: SafeRoom;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const DisplayReserveModal = ({ displayId, booking, roomId, }) => {
  const { data: roomBookingState, error } = useSWR(
    displayId ? `/api/rooms/${displayId}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: false }
  );

  const displayReserveModal = useDisplayReserveModal();
  const [isLoading, setIsLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [maxAvailableMinutes, setMaxAvailableMinutes] = useState<number>(0);

  const [starttime, setStartTime] = useState<Date>();
  const [endtime, setEndTime] = useState<Date>();

  const isNextBooking = (endtime: Date) => {
    const now = new Date();
    const end = new Date(
      new Date(endtime).getTime() + now.getTimezoneOffset() * 60 * 1000
    );
    return now < end;
  };

  const nextBooking = roomBookingState?.find((booking) =>
    isNextBooking(booking.endtime)
  );

  //다음시간 예약 시간 까지 남은 시간
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const nextRemainingTime = nextBooking && new Date(new Date(nextBooking.starttime).getTime() + timezoneOffset).getTime() - currentDate.getTime();
  // 오늘 오후8시 30분까지 남은 시간 timezoneOffset 추가
  const todayRemainingTime = new Date(new Date().setHours(20, 30, 0, 0)).getTime() - currentDate.getTime();
  

  const formatRemainingTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatRemainingMinutes = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    return minutes.toString().padStart(2, "0");
  };

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
    const nextBooking = roomBookingState?.find((nextbooking) =>
      isNextBooking(nextbooking.endtime)
    );
    // 만약 필요하다면, 다른 상태를 업데이트하여 화면에 반영
  }, [currentDate, roomBookingState]);

  useEffect(() => {
    if (nextBooking) {
      const availableTime = Math.floor(nextRemainingTime / 60000); // convert milliseconds to minutes
      setMaxAvailableMinutes(availableTime);
    } else {
      const availableTime = Math.floor(todayRemainingTime / 60000); // convert milliseconds to minutes
      setMaxAvailableMinutes(availableTime);

    }
  }, [nextBooking, nextRemainingTime, todayRemainingTime]);

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset, // added reset function
  } = useForm<FieldValues>({
    defaultValues: {
      roomId: roomId.id,
      userId: null,
      user_email: null,
      starttime: starttime,
      endtime: endtime,
      attendees: 1,
      topic: "",
      booking_user: "",
      booking_pwd: "",
      checkin: "Y",
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

  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const newStarttime = addHours(new Date(), 9);
    const timeCounterValue = data.times || 10;

    const newEndTime = addMinutes(newStarttime, parseInt(timeCounterValue));

    data.starttime = format(newStarttime, "yyyy-MM-dd'T'HH:mm:ssXXX");
    data.endtime = format(newEndTime, "yyyy-MM-dd'T'HH:mm:ssXXX");

    setIsLoading(true);
    axios
      .post("/api/booking", data)
      .then(() => {
        reset();
        router.refresh();
        displayReserveModal.onClose();
        toast.success("회의실 사용 등록 되었습니다.");
      })
      .catch((error) => {
        /* if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            error.response.data.message || "중복된 예약 시간이 있습니다."
          );
        } */

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
    <div className="flex flex-col gap-2 overflow-y-auto text-black">
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

      <div className="flex flex-row w-full justify-between">
        <TimeCounter
          defaultTime={10}
          maxTime={maxAvailableMinutes}
          onChange={(value) => setCustomValue("times", value)}
          value={times}
          title="예약시간 선택"
          subtitle=""
        />
      </div>

      {nextBooking ? (
        <div className="justify-end align-middle">
          최대 {formatRemainingMinutes(nextRemainingTime)} 분까지 가능합니다.
        </div>
      ) : (
        <div className="justify-end align-middle">
          최대 {formatRemainingMinutes(todayRemainingTime)} 분까지 가능합니다.
        </div>
      )}

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
      isOpen={displayReserveModal.isOpen}
      title="회의실 예약"
      actionLabel="예약하기"
      onClose={displayReserveModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default DisplayReserveModal;
