const { Kafka } = require('../api/node_modules/kafkajs');

class KafkaProducer {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'katalon-api',
      brokers: ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
      console.log('✅ Kafka Producer connected');
    }
  }

  async sendMessage(topic, message) {
    try {
      await this.connect();
      
      await this.producer.send({
        topic: topic,
        messages: [
          { 
            key: String(message.data?.id || Date.now()),
            value: JSON.stringify(message)
          }
        ]
      });
      
      console.log(`📤 Message sent to ${topic}:`, message.event);
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.producer.disconnect();
      this.connected = false;
      console.log('🔌 Kafka Producer disconnected');
    }
  }
}

// Run standalone if executed directly
if (require.main === module) {
  const producer = new KafkaProducer();
  
  async function testProducer() {
    try {
      // Send test messages
      for (let i = 1; i <= 3; i++) {
        await producer.sendMessage('product-events', {
          event: 'PRODUCT_CREATED',
          data: {
            id: i,
            name: `Test Product ${i}`,
            price: 10000 * i,
            category: 'Test',
            stock: 10
          },
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('\n✅ Test messages sent successfully!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await producer.disconnect();
      process.exit(0);
    }
  }
  
  testProducer();
}

module.exports = { KafkaProducer };
