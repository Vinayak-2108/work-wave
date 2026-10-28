const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors=require("cors");

const dotenv = require("dotenv");

dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")
mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// CLIENT_URL may hold several comma-separated origins (e.g. prod + preview)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const YOUR_DOMAIN = process.env.DOMAIN_URL;

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1Mcx77SBTsTb4qbmfjFfZuNh',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
