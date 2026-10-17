const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    seatsBooked: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.virtual("seatsAvailable").get(function () {
  return this.totalSeats - this.seatsBooked;
});

eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
