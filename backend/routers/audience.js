import express from "express";
import Customer from "../models/customer.js";
import axios from "axios";
import Campaign from "../models/campaign.js";
import CommunicationLog from "../models/CommunicationLog.js";




const router = express.Router();
const buildFilter = (rules, logic) => {
    const operator = logic === 'and' ? '$and' : '$or';
    const conditions = rules.map(rule => {
        switch (rule.field) {
            case 'totalSpends':
                return { totalSpends: { [rule.operator]: rule.value } };
            case 'maxVisits':
                return { maxVisits: { [rule.operator]: rule.value } };
            case 'lastVisit':
                const dateValue = new Date(new Date() - rule.value * 24 * 60 * 60 * 1000);
                return { lastVisit: { [rule.operator]: dateValue } };
            default:
                return {};
        }
    });
    return { [operator]: conditions };
};


router.post('/save', async (req, res) => {
    try {
        const { rules, logic } = req.body;
        const filter = buildFilter(rules, logic);

        const customers = await Customer.find(filter);
        const audienceSize = await Customer.countDocuments(filter);
        const campaign = new Campaign({ audience: { customers, rules, logic }, sent: audienceSize });
        await campaign.save();



        customers.forEach(async (customer) => {
            const message = `Hi ${customer.name}, here is 10% off on your next order`;
            const logEntry = new CommunicationLog({
                audienceId: campaign._id,
                customerId: customer._id,
                message,
            });
            await logEntry.save();

            const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
            if (deliveryStatus == 'FAILED') {
                console.log("ghgie");
                await Campaign.findByIdAndUpdate(campaign._id, {$inc:{failed:1}});
            }

            await axios.post('http://localhost:8080/audience/delivery-receipt', {
                logId: logEntry._id,
                status: deliveryStatus,
            });
        });

        await publishMessage('message',JSON.stringify({ campaignId, message }));


        // console.log(audienceSize);
        res.json({ message: 'Campaign saved', campaign, audienceSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/size', async (req, res) => {
    try {
        const { rules, logic } = req.body;
        const filter = buildFilter(rules, logic);
        const audienceSize = await Customer.countDocuments(filter);
        res.json({ audienceSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.post('/delivery-receipt', async (req, res) => {
    try {
        const { logId, status } = req.body;
        await CommunicationLog.findByIdAndUpdate(logId, { status });
        res.json({ message: 'Delivery receipt updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;