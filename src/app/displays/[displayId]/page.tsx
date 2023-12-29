import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import DisplayClient from "./DisplayClient";
import getDisplayById from "@/app/action/getDisplayById";
import getRoomBookingList from "@/app/action/getRoomBookingList";
import getCurrentUser from "@/app/action/getCurrentUser";

interface IParams {
  displayId?: string;
}

const DisplayPage = async ({ params }: { params: IParams }) => {
  const { displayId } = params; 

  const roomid = await getDisplayById(params);
  
  const roomBooking = await getRoomBookingList(params);
  const currendUser = await getCurrentUser();
  
  return (
    <Container>
      <ClientOnly>
        <DisplayClient
          displayId={displayId}
          roomInfo={roomid}
          Bookings={roomBooking}
          currentUser={currendUser}
        />
      </ClientOnly>
    </Container>
  );
};

export default DisplayPage;
