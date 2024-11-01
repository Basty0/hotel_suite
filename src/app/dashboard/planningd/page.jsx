import ReservationTimeline from "./_component/ReservationTimeline";
import { reservations } from "./_data/reservationsData";

export default function ReservationsPage() {
  return <ReservationTimeline reservations={reservations} />;
}
