import useSWR from "swr";
import axios from "axios";


interface Booking {
  roomId?: string;
}
const RoomBookingStatus = ({ roomId
}: { roomId: number }) => {
  
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data, error } = useSWR<Booking[]>(`/api/displays/${roomId}`, fetcher);

  if (error) return <div>Failed to load bookings</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((booking) => (
        <div key={booking.id}>
          <h2>Booking ID: {booking.id}</h2>
          <p>Start Time: {new Date(booking.starttime).toLocaleTimeString()}</p>
          <p>End Time: {new Date(booking.endtime).toLocaleTimeString()}</p>
          <p>Topic: {booking.topic}</p>
          {/* ... Render other booking details as needed ... */}
        </div>
      ))}
    </div>
  );
}

export default RoomBookingStatus;
