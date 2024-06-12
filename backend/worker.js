// // // import amqp from 'amqplib';
// // // import CommunicationLog from "./models/CommunicationLog";

// // // const BATCH_SIZE = 10;
// // // const QUEUE_NAME = 'delivery-receipts';

// // // const connectRabbitMQ = async () => {
// // //     const connection = await amqp.connect('amqp://localhost');
// // //     return connection.createChannel();
// // // };

// // // const processMessages = async (messages) => {
// // //     const bulkOperations = messages.map(({ logId, status }) => ({
// // //         updateOne: {
// // //             filter: { _id: logId },
// // //             update: { status }
// // //         }
// // //     }));
// // //     await CommunicationLog.bulkWrite(bulkOperations);
// // //     console.log(`Processed ${messages.length} messages`);
// // // };

// // // const consumeMessages = async () => {
// // //     const channel = await connectRabbitMQ();
// // //     await channel.assertQueue(QUEUE_NAME, { durable: true });
// // //     let messageBatch = [];

// // //     channel.consume(QUEUE_NAME, (msg) => {
// // //         if (msg !== null) {
// // //             const message = JSON.parse(msg.content.toString());
// // //             messageBatch.push(message);

// // //             if (messageBatch.length >= BATCH_SIZE) {
// // //                 processMessages(messageBatch);
// // //                 messageBatch = [];
// // //             }
// // //             channel.ack(msg);
// // //         }
// // //     });
// // // };

// // // consumeMessages().catch(console.error);



// // import { Worker } from "bullmq";
// // import IORedis from "ioredis";
// // import CommunicationLog from "../models/CommunicationLog.js";
// // import Campaign from "../models/campaign.js";

// // const connection = new IORedis();

// // const processDelivery = async (job) => {
// //     const { logId, campaignId, customerId, message } = job.data;
// //     try {
// //         const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        
// //         // Update communication log
// //         await CommunicationLog.findByIdAndUpdate(logId, { status: deliveryStatus });

// //         // If the message failed, increment the failed count in the campaign
// //         if (deliveryStatus === 'FAILED') {
// //             await Campaign.findByIdAndUpdate(campaignId, { $inc: { failed: 1 } });
// //         }

// //         // Simulate sending the message
// //         await axios.post('http://localhost:8080/audience/delivery-receipt', {
// //             logId: logId,
// //             status: deliveryStatus,
// //         });

// //     } catch (error) {
// //         console.error(`Failed to process delivery for logId: ${logId}`, error);
// //     }
// // };

// // // Create a worker to process the queue
// // const worker = new Worker("deliveryQueue", processDelivery, { connection });

// // worker.on("completed", (job) => {
// //     console.log(`Job ${job.id} has completed!`);
// // });

// // worker.on("failed", (job, err) => {
// //     console.log(`Job ${job.id} has failed with ${err.message}`);
// // });



// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import CommunicationLog from "../models/CommunicationLog.js";
// import Campaign from "../models/campaign.js";
// import axios from "axios";

// const connection = new IORedis();

// const processDelivery = async (job) => {
//     const { logId, campaignId, customerId, message } = job.data;
//     try {
//         const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        
//         // Update communication log
//         await CommunicationLog.findByIdAndUpdate(logId, { status: deliveryStatus });

//         // If the message failed, increment the failed count in the campaign
//         if (deliveryStatus === 'FAILED') {
//             await Campaign.findByIdAndUpdate(campaignId, { $inc: { failed: 1 } });
//         }

//         // Simulate sending the message
//         await axios.post('http://localhost:3000/customers/delivery-receipt', {
//             logId: logId,
//             status: deliveryStatus,
//         });

//     } catch (error) {
//         console.error(`Failed to process delivery for logId: ${logId}`, error);
//     }
// };

// // Create a worker to process the queue
// const worker = new Worker("deliveryQueue", processDelivery, { connection });

// worker.on("completed", (job) => {
//     console.log(`Job ${job.id} has completed!`);
// });

// worker.on("failed", (job, err) => {
//     console.log(`Job ${job.id} has failed with ${err.message}`);
// });




const amqp = require('amqplib');
const axios = require('axios');
const mongoose = require('mongoose');
const CommunicationLog = require('./models/CommunicationLog'); // Adjust path as necessary
const Campaign = require('./models/Campaign'); // Adjust path as necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_db', { useNewUrlParser: true, useUnifiedTopology: true });

async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('customer_messages');

    channel.consume('customer_messages', async (msg) => {
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString());

            const logEntry = new CommunicationLog({
                audienceId: message.audienceId,
                customerId: message.customerId,
                message: message.text,
            });
            await logEntry.save();

            const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
            if (deliveryStatus === 'FAILED') {
                await Campaign.findByIdAndUpdate(message.audienceId, { $inc: { failed: 1 } });
            }

            await axios.post('http://localhost:8080/audience/delivery-receipt', {
                logId: logEntry._id,
                status: deliveryStatus,
            });

            channel.ack(msg);
        }
    });
}

consumeMessages().catch(console.error);
