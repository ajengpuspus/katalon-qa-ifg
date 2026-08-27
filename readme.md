# Katalon Kafka API Testing Project

Technical test project: REST API testing + Kafka consumer testing using Katalon Studio.

## Project Structure

```
katalon-project/
├── api/                          # REST API (Node.js + Express)
│   ├── server.js                 # API server with request logging
│   ├── database.js               # SQLite database + sample data
│   └── package.json
├── kafka/                        # Kafka producer/consumer (Node.js)
│   ├── producer.js               # Sends messages to Kafka
│   ├── consumer.js               # Receives messages from Kafka
│   └── consumed_messages.json
├── Katalon/test/                 # Katalon Studio project
│   ├── Test Cases/
│   │   ├── REST_API_Producer/    # Create/Update products
│   │   ├── REST_API_Consumer/    # Read products
│   │   └── Kafka_Consumer/       # Kafka integration
│   ├── Test Suites/
│   │   └── MainTestSuite
│   ├── Scripts/                  # Groovy test scripts
│   └── Object Repository/
│       └── REST API/             # API request objects
├── docker-compose.yml            # Kafka Docker setup
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- Docker
- Katalon Studio

### 1. Start Kafka
```bash
cd D:\_ajeng\katalon
docker-compose up -d
```

### 2. Install & Start REST API
```bash
cd D:\_ajeng\katalon\api
npm install
npm start
```

### 3. Open Katalon Studio
1. File → Open Project
2. Select `D:\_ajeng\katalon\Katalon\test`
3. Right-click project → Refresh

### 4. Create Test Suite (if not exists)
1. Right-click Test Suites → New → Test Suite
2. Name: MainTestSuite
3. Add these test cases:
   - REST_API_Producer/Create_Product
   - REST_API_Consumer/Read_Products
   - Kafka_Consumer/Kafka_Consumer_Test
4. Click Run ▶️

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product (triggers Kafka event) |
| PUT | /api/products/:id | Update product (triggers Kafka event) |
| DELETE | /api/products/:id | Delete product (triggers Kafka event) |
| GET | /api/health | Health check |

## Test Cases

### REST API Producer (Create_Product)
- Health Check
- Create new product via POST
- Create multiple products

### REST API Consumer (Read_Products)
- Get all products
- Get product by ID
- Handle 404 for non-existent product
- Verify data structure

### Kafka Consumer (Kafka_Consumer_Test)
- Create product via API (triggers Kafka event)
- Verify API is running
- End-to-end: Create → Verify → Update

## Manual Testing (curl)

```bash
# Get all products
curl http://localhost:3000/api/products

# Create product
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"price\":50000,\"category\":\"Test\"}"

# Get product by ID
curl http://localhost:3000/api/products/1
```

## Test Kafka Separately

```bash
cd D:\_ajeng\katalon\kafka

# Send test messages
node producer.js

# Listen for messages
node consumer.js
```

## Troubleshooting

### Tests fail with empty body
- Check Create Product request object has correct header:
  - Name: Content-Type (no leading space!)
  - Value: application/json

### Kafka not working
```bash
docker ps | grep kafka
docker-compose logs kafka
```

### API not responding
```bash
curl http://localhost:3000/api/health
```

## Tech Stack
- **API:** Express.js + SQLite (better-sqlite3)
- **Kafka:** Apache Kafka via Docker (port 9092)
- **Kafka Client:** kafkajs
- **Testing:** Katalon Studio (Groovy scripts)
