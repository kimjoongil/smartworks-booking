"use client";

import { useCallback, useState } from "react";
import Modal from "./Modal";
import useReservationModal from "@/hooks/useReservationModal";

const ReservationModal = () => {
  const reservationModal = useReservationModal();
  const [isLoading, setIsLoading] = useState(true);

  const onToggle = useCallback(() => {
    reservationModal.onClose();
  }, [reservationModal]);

  const bodyContent = <div className="flex flex-col gap-4">blah blah blah</div>;

  const footerContent = <>특별이 할말이 있는경우</>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={reservationModal.isOpen}
      title="직원 정보 등록"
      actionLabel="가입하기"
      onClose={reservationModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ReservationModal;
