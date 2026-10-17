const express = require("express");
const { createOrder, verifyPayment, getMyBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my", protect, getMyBookings);

module.exports = router;
