import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";

import getCurrentUser from "@/app/action/getCurrentUser";
import MypageClient from "./MypageClient";
import getReservations from "../action/getReservations";


const MyPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }
  
  const reservations = await getReservations({ userId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="등록된 예약 정보가 없습니다."
          subtitle="회의실 예약을 해주세요"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="p-5">
        <MypageClient reservations={reservations} currentUser={currentUser} />
      </div>
    </ClientOnly>
  );
};

export default MyPage;
