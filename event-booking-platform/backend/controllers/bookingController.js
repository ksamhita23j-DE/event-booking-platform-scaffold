const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/bookings/create-order
// Step 1 of checkout: reserve seats conceptually and create a Razorpay order.
// NOTE (you): a real production version should hold/lock the seats here
// (e.g. a short-lived reservation) so two people can't buy the last seat at
// the same time. That's a good "Requirement Gathering / non-functional
// requirement" to write up in your report — think about how you'd solve it.
const createOrder = async (req, res, next) => {
  try {
    const { eventId, seats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const seatsAvailable = event.totalSeats - event.seatsBooked;
    if (seats > seatsAvailable) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const amount = event.price * seats * 100; // Razorpay expects paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      seats,
      amount: amount / 100,
      status: "pending",
      razorpayOrderId: order.id,
    });

    res.status(201).json({ order, bookingId: booking._id, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/verify
// Step 2 of checkout: verify the payment signature Razorpay's checkout.js
// returns to the frontend, THEN mark the booking paid and decrement seats.
// Verifying server-side (not trusting the frontend) is the whole point —
// explain this in the report's "Payments Integration" section.
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, { status: "failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    await Event.findByIdAndUpdate(booking.event, {
      $inc: { seatsBooked: booking.seats },
    });

    res.json({ message: "Payment verified", booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date venue imageUrl")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, verifyPayment, getMyBookings };
