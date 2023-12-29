"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

import MenuItem from "./MenuItem";

import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

import { AiOutlineMenu } from "react-icons/ai";
import { SafeUser } from "@/types";
import useRoomReserveModal from "@/hooks/useRoomReserveModal";

interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const roomReserveModal = useRoomReserveModal();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(()=>{
    setIsOpen((value) => !value);
  }, []);
  
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  

  const handleLoginClick = useCallback(() => {
    setIsOpen(false);
    loginModal.onOpen();
  }, [loginModal]);

  const handleRegisterClick = useCallback(() => {
    setIsOpen(false);
    registerModal.onOpen();
  }, [registerModal]);

  const handeleRoomReserveClick = useCallback(() => {
    setIsOpen(false);
    if (!currentUser) {
      return loginModal.onOpen();
    }
    roomReserveModal.onOpen();
  }, [currentUser, loginModal, roomReserveModal]);  

  return (
    <>
      <div className="flex">
        <div className="inline-flex mr-3 items-center text-white">
          {currentUser ? (
            <>{currentUser.name} 님 환영합니다.</>
          ) : (
            <>직원 전용 입니다.</>
          )}
        </div>
        <div className="relative" ref={ref}>
          <div className="flex flex-row items-center gap-3">
            <div
              onClick={toggleOpen}
              className="text-2xl text-white hover:text-orange-200 transition cursor-pointer"
            >
              <AiOutlineMenu />
            </div>
            {isOpen && (
              <div className="absolute rounded-sm shadow-md w-[40vw] sm:w-[200px] bg-white overflow-hidden right-0 top-12 text-sm z-50">
                <div className="flex flex-col cursor-pointer text-black p-4">
                  {/* <MenuItem
                    onClick={() => router.push("/displays/1")}
                    label="하와이"
                  /> */}
                  {currentUser ? (
                    <>
                      <MenuItem
                        label="익명낙서"
                        onClick={() => router.push("/products")}
                      />
                      <MenuItem
                        onClick={() => router.push("/mypage")}
                        label="나의예약정보"
                      />
                      <MenuItem
                        onClick={() =>
                          signOut({ redirect: false }).then(() => {
                            router.push("/");
                            router.refresh();
                          })
                        }
                        label="로그아웃"
                      />
                    </>
                  ) : (
                    <>
                      <MenuItem
                        label="익명낙서"
                        onClick={() => router.push("/products")}
                      />
                      <MenuItem onClick={handleLoginClick} label="로그인" />
                      <MenuItem onClick={handleRegisterClick} label="가입" />

                      {/* <MenuItem
                        onClick={() => router.push("/products")}
                        label="상품등록"
                      /> */}
                    </>
                  )}
                  <MenuItem
                    label="이용 Guide"
                    onClick={() => router.push("/guide")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserMenu;
