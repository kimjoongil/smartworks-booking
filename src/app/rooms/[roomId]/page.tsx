import ClientOnly from "@/components/ClientOnly";
import getRoomById from "@/app/action/getRoomById";
import RoomClient from "./RoomClient";
import getRoomBookingList from "@/app/action/getRoomBookingList";
import getCurrentUser from "@/app/action/getCurrentUser";
import Container from "@/components/Container";
import { Toaster } from "react-hot-toast";


interface IParams {
  roomId?: string;
}

const RoomPage = async({ params }: { params: IParams }) => {
  const { roomId } = params; 
  
  const roomid = await getRoomById(params); 
  const roomBooking = await getRoomBookingList(params);
  const currendUser = await getCurrentUser();
  

  
  return (
    <Container>
      <ClientOnly>
        <Toaster />
        <RoomClient
          roomId={roomid}
          roomBookings={roomBooking}
          currentUser={currendUser}
        />
      </ClientOnly>
    </Container>
  );

}

export default RoomPage;