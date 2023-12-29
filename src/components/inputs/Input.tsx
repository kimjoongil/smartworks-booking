'use client'

import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiWon } from "react-icons/bi";
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  numOnly?: boolean;
  autocomplete?:string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  numOnly = false,
  autocomplete = "on",
  required,
  register,
  errors,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false); // 패스워드 보기/숨기기 상태 추가

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 값 가져오기
    let inputValue = event.target.value;
    if (numOnly) {
      // 숫자만 남기고 나머지 문자 제거
      inputValue = inputValue.replace(/[^0-9]/g, "");
      // 최대 길이 설정 (예: 최대 10자)
      const maxLength = 4;
      inputValue = inputValue.slice(0, maxLength);
    }
    // 변경된 값 적용
    event.target.value = inputValue;
    // onChange 이벤트 핸들러 호출
    if (onChange) {
      onChange(event);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="w-full relative text-slate-900">
      {formatPrice && (
        <BiWon size={24} className="absolute top-5 left-2" />
      )}

      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        type={type === "password" ? (showPassword ? "text" : "password") : type} // 패스워드 입력 필드의 type 조절        
        onChange={handleInputChange}
        className={`peer w-full p-4 pt-6 font-semibold text-base bg-white border-[1px] rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              ${formatPrice ? "pl-9" : "pl-4"}              
              ${errors[id] ? "border-rose-500" : "border-x-neutral-300"}
              ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      {type === "password" && ( // 패스워드 입력 필드인 경우에만 아이콘 표시
        <div
          className="absolute top-6 right-4 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </div>
      )}

      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-auto origin-[0]
              ${formatPrice ? "left-9" : "left-4"}
              peer-placeholder-shown:scale-100
              peer-placeholder-shown:translate-y-0
              peer-focus:scale-75
              peer-focus:-translate-y-4
              ${errors[id] ? "text-rose-500" : "text-zinc-400"}
      `}
      >
        {label}
      </label>
    </div>
  );
};
 
export default Input;