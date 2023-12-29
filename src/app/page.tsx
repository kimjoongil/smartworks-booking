
import Image from 'next/image'
import Container from '@/components/Container';
import getRoomList from './action/getRoomList';
import getCurrentUser from './action/getCurrentUser';
import RoomListCard from '@/components/rooms/RoomListCard';
import Link from 'next/link';

export default async function Home() {

  const roomList = await getRoomList();
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <div className="flex flex-row justify-center md:justify-start">
        <div className="relative m-4 w-[30px] h-[30px] lg:w-[100px] lg:h-[100px]">
          <Image
            className="m-auto"
            src="/images/asone_logo_symbol.svg"
            sizes="100px"
            fill
            style={{
              objectFit: "contain",
            }}
            alt="asone"
          />
        </div>
        <h2 className="inline-flex text-base lg:text-5xl text-orange-600 ml-3 align-middle items-center">
          애즈원 예약 시스템
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        {roomList.map((room, index) => {
          return (
            <RoomListCard currentUser={currentUser} key={room.id} data={room} />
          );
        })}
      </div>

     
    </Container>
  );
}
