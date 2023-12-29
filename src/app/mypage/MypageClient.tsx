"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeBooking, SafeUser } from "@/types";

import Heading from "@/components/Heading";
import Container from "@/components/Container";
import RoomListCard from "@/components/rooms/RoomListCard";

interface MypageClientProps {
  reservations: SafeBooking;
  currentUser?: SafeUser | null;
}

const MypageClient: React.FC<MypageClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("예약이 취소 되었습니다.");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="나의 예약 정보"
        subtitle="회의실 예약정보를 확인할 수 있습니다."
      />
      <div
        className="
          mt-10
          grid 
          grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations.map((reservation: any) => (
          <RoomListCard
            key={reservation.id}
            data={reservation.roomtbl}
            booking={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="예약취소"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default MypageClient;
