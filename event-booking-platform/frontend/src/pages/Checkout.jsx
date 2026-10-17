import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

// Loads Razorpay's checkout.js script once, on demand.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setError("");
    setProcessing(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Could not load payment gateway");

      const { data } = await api.post("/bookings/create-order", { eventId, seats });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Event Booking Platform",
        description: "Ticket booking",
        order_id: data.order.id,
        handler: async (response) => {
          await api.post("/bookings/verify", {
            ...response,
            bookingId: data.bookingId,
          });
          navigate("/my-bookings");
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setError("Payment failed. Please try again."));
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <h1>Checkout</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>Number of seats</label>
      <input
        type="number"
        min={1}
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
      />
      <button disabled={processing} onClick={handlePay}>
        {processing ? "Processing..." : "Pay with Razorpay"}
      </button>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Uses Razorpay TEST mode - use their published test card numbers, no
        real money moves. See README for details.
      </p>
    </div>
  );
}
