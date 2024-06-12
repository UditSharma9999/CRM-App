import express from "express";
import Order from "../models/order.js";

const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { customerId, amount, date } = req.body;
        if (!customerId || !amount || !date) {
            return res.status(400).send('Invalid input data');
        }
            
        const order = new Order(req.body);
        await order.save();

        res.status(200).send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;