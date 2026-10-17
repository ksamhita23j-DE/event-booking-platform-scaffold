import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const handleBook = () => {
    if (!user) return navigate("/login");
    navigate(`/checkout/${event._id}`);
  };

  return (
    <div className="card">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>
        <strong>Venue:</strong> {event.venue}
      </p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> ₹{event.price} per seat
      </p>
      <p>
        <strong>Seats available:</strong> {event.seatsAvailable}
      </p>
      <button disabled={event.seatsAvailable < 1} onClick={handleBook}>
        {event.seatsAvailable < 1 ? "Sold out" : "Book now"}
      </button>
    </div>
  );
}
