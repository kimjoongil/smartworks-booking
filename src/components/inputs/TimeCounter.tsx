"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface TimeCounterProps {
  defaultTime: number;
  maxTime: number;
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

const TimeCounter: React.FC<TimeCounterProps> = ({
  defaultTime = 10,
  maxTime,
  title,
  subtitle,
  value = defaultTime,
  onChange,
}) => {
  const onAdd = useCallback(() => {
    if (value + 10 > maxTime && maxTime > 0) {
      toast.error("더 이상 시간을 추가 할 수 없습니다.", { duration: 1000 }); // 사용자에게 알림을 표시
    } else {
      onChange(value + 10);
    }
  }, [onChange, value, maxTime]);

  const onReduce = useCallback(() => {
    if (value > defaultTime) {
      onChange(value - 10);
    }
  }, [onChange, value, defaultTime]);

  return (
    <div className="flex flex-col items-start justify-between">
      <div className="flex flex-col whitespace-nowrap">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4 py-2 rounded-md outline-none hover:border-black">
        <div
          onClick={onReduce}
          className="
            w-10
            h-10                        
            flex
            items-center
            justify-center
            bg-slate-900
            text-neutral-200
            rounded-lg
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlineMinus />
        </div>
        <div
          className="
            w-8            
            font-light 
            text-xl 
            text-neutral-600
            text-center            
          "
        >
          {value}
        </div>
        <div
          onClick={onAdd}
          className="
            w-10
            h-10                        
            flex
            items-center
            justify-center
            bg-slate-900
            text-neutral-200
            rounded-lg
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlinePlus />
        </div>
        <div>분</div>
      </div>
    </div>
  );
};

export default TimeCounter;
