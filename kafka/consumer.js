const { Kafka } = require('../api/node_modules/kafkajs');
const fs = require('fs');
const path = require('path');

class KafkaConsumer {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'katalon-consumer',
      brokers: ['localhost:9092']
    });
    this.consumer = this.kafka.consumer({ groupId: 'katalon-group' });
    this.messages = [];
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.consumer.connect();
      this.connected = true;
      console.log('✅ Kafka Consumer connected');
    }
  }

  async subscribe(topic) {
    await this.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });
    console.log(`📥 Subscribed to topic: ${topic}`);
  }

  async startConsuming(callback) {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = JSON.parse(message.value.toString());
        console.log(`\n📨 Received message:`);
        console.log(`   Topic: ${topic}`);
        console.log(`   Event: ${value.event}`);
        console.log(`   Data:`, JSON.stringify(value.data, null, 2));
        console.log(`   Time: ${value.timestamp}`);
        
        this.messages.push(value);
        
        if (callback) {
          callback(value);
        }
      }
    });
  }

  getMessages() {
    return this.messages;
  }

  clearMessages() {
    this.messages = [];
  }

  async disconnect() {
    if (this.connected) {
      await this.consumer.disconnect();
      this.connected = false;
      console.log('🔌 Kafka Consumer disconnected');
    }
  }
}

// Run standalone if executed directly
if (require.main === module) {
  const consumer = new KafkaConsumer();
  
  async function runConsumer() {
    try {
      await consumer.subscribe('product-events');
      
      console.log('\n⏳ Waiting for messages... (Press Ctrl+C to stop)\n');
      
      await consumer.startConsuming((message) => {
        // Save to file for verification
        const logFile = path.join(__dirname, 'consumed_messages.json');
        const messages = consumer.getMessages();
        fs.writeFileSync(logFile, JSON.stringify(messages, null, 2));
        console.log(`💾 Messages saved to consumed_messages.json`);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  runConsumer();
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down consumer...');
    await consumer.disconnect();
    process.exit(0);
  });
}

module.exports = { KafkaConsumer };
