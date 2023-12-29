import useSWR from "swr";

type Booking = {
  id: number;
  roomId: number;
  starttime: Date;
  endtime: Date;
  status: string;
};

function fetcher(url: string): Promise<Booking[]> {
  return fetch(url).then((res) => res.json());
}

interface BookingComponentProps {
  roomId: string;
}

const BookingComponent: React.FC<BookingComponentProps> = ({ roomId }) => {
  const { data, error } = useSWR<Booking[]>(
    `/api/getBookingStatus?roomId=${roomId}`,
    fetcher
  );

  if (error) return <div>Error loading booking status</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((booking) => (
        <div key={booking.id}>
          <strong>Start Time:</strong> {new Date(booking.starttime).toLocaleString()}
          <br />
          <strong>End Time:</strong> {new Date(booking.endtime).toLocaleString()}
          <br />
          <strong>Status:</strong> {booking.status}
          <br />
          <br />
        </div>
      ))}
    </div>
  );
};

export default BookingComponent;
