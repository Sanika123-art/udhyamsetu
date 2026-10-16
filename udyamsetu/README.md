# Udyam सेतू – Rural Enterprise Platform (React + Node.js)
Real-time marketplace connecting rural entrepreneurs (sellers) with buyers. Admin manages both. English / मराठी / हिंदी.

## Run (Node.js 18+ required)
    npm run setup     # installs root, server and client dependencies (internet needed once)
    npm run dev       # API on :4000, web app on http://localhost:5173

Single-port mode: `npm run build && npm start` -> http://localhost:4000

## Logins
- Admin (pre-created): mobile 9999999999 / password admin123 (change in server/index.js)
- Seller & Buyer: use Register on the login screen (open two browser windows to see real-time updates)

## Demo flow
1. Window A: register as Seller -> Products -> add "Bamboo Basket" (try AI Catalogue / voice).
2. Window B: register as Buyer -> Market -> search -> Enquiry.
3. Window A instantly shows a notification + the enquiry -> Accept -> order created, stock reduced.
4. Window B sees the status update live; seller advances order Confirmed -> Shipped -> Delivered.
5. Login as Admin (third window): live counts, block/unblock users, remove products, see all enquiries/orders.

## Unique features
- Market Pulse: live demand chart built from real buyer searches + enquiries per category
- Price Advisor: compares seller price with other sellers' average in the same category
- Monthly Income Goal ring, 7-day sales chart, voice input, AI catalogue helper (rule-based, no API key needed)

## Notes
- Data is stored in server/db.json (no database setup). Delete it to reset.
- Real-time uses Socket.IO; JWT auth; passwords hashed with bcrypt.
