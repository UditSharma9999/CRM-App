import express from "express";
import Customer from "../models/customer.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).send('Invalid input data');
        }
        const customer = new Customer(req.body);
        await customer.save();
        res.status(200).send({"msg":"user created"});
    } catch (error) {
        res.status(400).send(error);
    }
});





export default router;