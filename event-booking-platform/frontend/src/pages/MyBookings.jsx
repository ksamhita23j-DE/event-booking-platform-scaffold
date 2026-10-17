import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((b) => (
        <div className="card" key={b._id}>
          <h3>{b.event?.title}</h3>
          <p>
            {b.seats} seat(s) &middot; ₹{b.amount} &middot; status: {b.status}
          </p>
        </div>
      ))}
    </div>
  );
}
