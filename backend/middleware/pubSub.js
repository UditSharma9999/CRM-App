// import amqp from "amqplib"
// async function publishToQueue(message) {
//   console.log(message);
//   const connection = await amqp.connect('amqp://localhost');
//   const channel = await connection.createChannel();
//   // await channel.assertQueue(QUEUE_NAME, { durable: true });
//   // channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
//   console.log('Message sent to queue:', message);
//   // await channel.close();
//   // await connection.close();
// }

// export {publishToQueue};