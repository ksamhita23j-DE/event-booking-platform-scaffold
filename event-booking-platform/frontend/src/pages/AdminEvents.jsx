import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  venue: "",
  date: "",
  price: "",
  totalSeats: "",
};

// TODO (you): this page is deliberately basic (create + list only). Adding
// edit/delete buttons per event, and better validation/feedback, is a good
// chunk of "your own" feature work to add and then describe in the report.
export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadEvents = () => api.get("/events").then((res) => setEvents(res.data));

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/events", {
        ...form,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
      });
      setForm(emptyForm);
      loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create event");
    }
  };

  return (
    <div>
      <h1>Manage Events</h1>
      <div className="card">
        <h3>Create new event</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Venue"
            required
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          <input
            type="datetime-local"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price per seat (INR)"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total seats"
            required
            value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
          />
          <button type="submit">Create event</button>
        </form>
      </div>

      <h3>Existing events</h3>
      {events.map((ev) => (
        <div className="card" key={ev._id}>
          <strong>{ev.title}</strong> - {ev.seatsBooked}/{ev.totalSeats} booked
        </div>
      ))}
    </div>
  );
}
