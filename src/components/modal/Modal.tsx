"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";


interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 0);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
  }, [disabled, secondaryAction]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  const handleBackClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="back relative w-full sm:w-4/6 lg:w-1/2 xl:w-[500px] my-6 mx-auto h-[100vh] overflow-y-auto sm:h-full  lg:h-auto z-10">
          {/* Modal content*/}
          <div
            className={`translate duration-300 h-auto 
                    ${showModal ? "translate-y-0" : "translate-y-full"} 
                    ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate h-auto lg:h-auto md:h-auto border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/* Modal HEADER */}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px] text-slate-800">
                <button
                  onClick={handleClose}
                  className="p-0 border-0 hover:opacity-70 transition absolute right-3 top-3 font-light"
                >
                  <IoMdClose size={30} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* Modal HEADER End */}

              {/* Modal BODY */}
              <div className="relative p-6 flex-auto">{body}</div>
              {/* Modal BODY End*/}

              {/* Modal FOOTER */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      disabled={disabled}
                      label={secondaryActionLabel}
                      bgcolor="bg-[#e4704e]"
                      onClick={handleSubmit}
                    />
                  )}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                    bgcolor="bg-[#e4704e]"
                  />
                </div>
                {footer}
              </div>
              {/* Modal FOOTER End*/}
            </div>
          </div>
        </div>
        <div
          className="flex absolute left-0 right-0 top-0 bottom-0 z-0"
          onClick={handleBackClick}
        ></div>
      </div>
    </>
  );
};

export default Modal;
