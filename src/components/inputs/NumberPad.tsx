"use client";
import getRoomBookingList from "@/app/action/getRoomBookingList";
import { SafeBooking } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PiArrowLeftLight } from "react-icons/pi";


interface NumberPadProps {
  onNumberClick?: (number: number) => void;
  onResetClick?: () => void;
  roomId?: string;
  bookingId:Number;
  
}

const PASSWORD_MAX_LENGTH = 4;
const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onResetClick,
  roomId,
  bookingId,
  
}) => {
  const [selectedNum, setSelectedNum] = useState("");

  const handleNumberClick = useCallback(
    (number: number) => {
      if (selectedNum.length < PASSWORD_MAX_LENGTH) {
        // 최대 4자까지만 입력 가능
        const newSelectedNum = selectedNum + number;
        setSelectedNum(newSelectedNum);
        onNumberClick?.(number);
      }
    },
    [selectedNum, onNumberClick]
  );

  const handleResetClick = () => {
    setSelectedNum("");
    onResetClick?.();
  };

  const handleDeleteClick = () => {
    setSelectedNum((prev) => prev.slice(0, -1));
  };

  

  return (
    <div className="flex flex-row justify-between">
      <div className="flex w-2/4 align-middle justify-center">
        <div className="flex w-full justify-center align-middle items-center">
          <div className="w-full h-[70px] text-7xl text-center align-middle bg-slate-900 border border-slate-900 rounded-md">
            <div>
              {selectedNum
                .split("")
                .map(() => "*")
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 w-[210px] text-lg">
        {Array.from({ length: 9 }, (v, index) => (
          <button
            key={index}
            onClick={() => handleNumberClick(index + 1)}
            className="w-[60px] h-[60px] border-[1px] m-[5px] rounded-full text-center bg-white text-black  spread-effect"
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleResetClick}
          className="w-[60px] h-[60px] border-[1px] m-2 rounded-full text-center bg-white text-black text-xs"
        >
          Reset
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          className="w-[60px] h-[60px] border-[1px] m-2 rounded-full text-center bg-white text-black"
        >
          0
        </button>
        <button
          onClick={handleDeleteClick}
          className="w-[60px] h-[60px] border-[1px] m-2 rounded-full justify-center items-center align-middle text-center bg-white text-black"
        >
          <div className="inline-block m-auto align-middle">
            <PiArrowLeftLight />
          </div>
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
