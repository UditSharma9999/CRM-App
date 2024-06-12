import redis from "redis";
import CommunicationLog from "../models/CommunicationLog";

const subscriber = redis.createClient();
let batch = [];

const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // 5 seconds

subscriber.on('message', (channel, message) => {
  batch.push(JSON.parse(message));
  if (batch.length >= BATCH_SIZE) {
    processBatch();
  }
});

const processBatch = async () => {
  if (batch.length === 0) return;

  const batchToProcess = batch.splice(0, BATCH_SIZE);
  try {
    await Receipt.insertMany(batchToProcess);
    console.log('Batch processed and saved to DB');
  } catch (error) {
    console.error('Error processing batch', error);
  }
};

const startConsumer = async () => {
  await connectDB();
  subscriber.subscribe('receipts');
  console.log('Subscribed to receipts channel');

  setInterval(processBatch, BATCH_INTERVAL);
};

startConsumer();
