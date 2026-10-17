import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events", { params: search ? { search } : {} })
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <input
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {!loading && events.length === 0 && (
        <p>
          No events yet.{" "}
          {/* TODO (you): once you have an admin account, create some events
              from /admin/events so this page has something to show. */}
        </p>
      )}
      {events.map((event) => (
        <div className="card" key={event._id}>
          <h3>{event.title}</h3>
          <p>
            {event.venue} &middot; {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            ₹{event.price} &middot; {event.seatsAvailable} seats left
          </p>
          <Link to={`/events/${event._id}`}>
            <button>View details</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
