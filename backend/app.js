import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import hemat from "helmet";
import cors from "cors";

import audience from "./routers/audience.js";
import campaigns from "./routers/campaigns.js";
import customer from "./routers/customer.js";
import order from "./routers/order.js";
import amqplib from "amqplib"
import authRoute from "./routers/authRoute.js"

dotenv.config();
const app = express();
const PORT = process.env.POST || 8080;

app.use(hemat())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/audience", audience);
app.use("/campaigns", campaigns);
app.use("/customer", customer);
app.use("/order", order);
app.use("/auth", authRoute);

app.use(express.static(path.join(dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(dirname, 'client/build', 'index.html'));
});


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () =>
            console.log(
                `mongoose connected and  servser is running on http://localhost:${PORT}/`
            )
        );
    })
    .catch((e) => {
        console.log(`Error: ${e}`);
    });
