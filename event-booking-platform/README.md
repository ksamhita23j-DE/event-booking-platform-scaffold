# Event Booking Platform (MERN Capstone Scaffold)

**Status: scaffold only.** This repository was generated as a starting
skeleton, not a finished, submittable project. Read the "What's here vs.
what you still need to do" section below before you submit anything with
your name on it - your program requires you to attest that you are the
sole creator of the project, and this scaffold on its own does not meet
that bar honestly.

## What this is

A MERN-stack event booking platform: browse events, book seats, pay online
via Razorpay (test mode), and an admin view to create events. It's the kind
of project the "Full Stack LLD & Projects" course points toward (Node/Express
backend, MongoDB/Mongoose, React frontend, payment gateway, deployment).

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt password
  hashing, helmet + express-rate-limit + cors for security, Razorpay for
  payments.
- **Frontend:** React (Vite), React Router, Axios.

## Folder structure

```
event-booking-platform/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # User, Event, Booking (Mongoose schemas)
│   ├── controllers/           # Route handler logic
│   ├── routes/                # Express route definitions
│   ├── middleware/             # auth (JWT), validation, error handling
│   ├── server.js               # App entry point, security middleware wiring
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/               # EventsList, EventDetail, Login, Register,
    │   │                        # Checkout, MyBookings, AdminEvents
    │   ├── context/AuthContext.jsx
    │   ├── api/axios.js
    │   └── App.jsx
    └── .env.example
```

## Running it locally

**Backend**
```
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, Razorpay test keys
npm install
npm run dev                # requires nodemon; or `npm start`
```

**Frontend**
```
cd frontend
cp .env.example .env
npm install
npm run dev
```

You'll need:
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster for `MONGO_URI`.
- A free [Razorpay](https://dashboard.razorpay.com/signup) account, switched to
  **Test Mode**, for `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`. Test mode uses
  [published test card numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/) -
  no real money moves.
- To make yourself an admin (to create events), register a normal account,
  then manually edit that user's `role` field to `"admin"` in MongoDB Atlas
  (or via `mongosh`), since there's no admin-signup flow by design.

## Deployment (matches the report template's "Deployment Flow" section)

- **Backend:** Render or a similar Node host. `Procfile` and `render.yaml` are
  included. Set the env vars from `.env.example` in the host's dashboard -
  never commit the real `.env`.
- **Frontend:** Netlify. `netlify.toml` is included and handles the
  React Router redirect rule. Set `VITE_API_URL` to your deployed backend's
  URL in Netlify's environment variables.
- **CORS:** update `CLIENT_URL` in the backend's env vars to your deployed
  Netlify URL once you have one, or the frontend won't be able to call the API.

## Security notes (for the report's "Security" section)

- Passwords are hashed with bcrypt (12 salt rounds) - never stored in plain
  text, never compared with `===`.
- JWTs are signed with a server-side secret and expire (`JWT_EXPIRES_IN`).
- `helmet()` sets protective HTTP response headers.
- `express-rate-limit` throttles the `/api/auth` routes to blunt brute-force
  attempts.
- Payment verification happens server-side, using an HMAC signature check
  against Razorpay's secret key - the frontend's claim that "payment
  succeeded" is never trusted on its own (see `bookingController.js`).

## What's here vs. what you still need to do

This scaffold gives you working boilerplate for the "plumbing": auth,
routing, a payment flow, security middleware, deployment config. It is
intentionally incomplete / rough in places, marked with `TODO (you)`
comments, because the point of a capstone is that you build and understand
the actual project. Before this is genuinely submittable, you should:

1. **Run it, break it, fix it.** Actually get it running locally end-to-end.
2. **Extend the features** - e.g. seat-locking during checkout so two people
   can't buy the same last seat, event image uploads, event categories/search
   filters, admin edit/delete UI, email confirmations, etc. Pick a few real
   ones and build them yourself.
3. **Write the report from what you actually built**, following the WOOLF
   template structure, in your own words - especially the sections that ask
   you to explain *why* (security choices, payment flow, deployment
   decisions), not just *what*.
4. **Commit iteratively as you go** (the course's own guidance) - not one
   giant commit at the end. Reviewers can see the difference.
5. Push to a **public** GitHub repo before submitting the link.

If you want help with any of these next steps - implementing a specific
feature, debugging something that's not working, or reviewing code you've
written - come back and ask for that directly; that's the kind of help I
can give in full.
