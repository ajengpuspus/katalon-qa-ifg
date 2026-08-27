# Katalon Kafka API Testing Project

A complete testing project demonstrating REST API and Kafka integration testing using Katalon Studio.

## Project Structure

```
katalon-project/
├── api/                          # REST API (Node.js + Express)
│   ├── server.js                 # Main server with CRUD endpoints
│   ├── database.js               # SQLite database setup
│   └── package.json              # API dependencies
├── kafka/                        # Kafka producer/consumer
│   ├── producer.js               # Sends messages to Kafka
│   └── consumer.js               # Receives messages from Kafka
├── Katalon/                      # Katalon test project
│   ├── Test Cases/
│   │   ├── REST_API_Producer/    # API producer tests
│   │   ├── REST_API_Consumer/    # API consumer tests
│   │   └── Kafka_Consumer/       # Kafka consumer tests
│   └── Test Suites/
│       └── MainTestSuite.robot   # Complete test suite
├── docker-compose.yml            # Kafka Docker setup
└── README.md                     # This file
```

## Quick Start

### Prerequisites

- Java 17+ (for Katalon)
- Node.js 18+ (for API)
- Docker (for Kafka)
- Katalon Studio (for running tests)

### Step 1: Start Kafka

```bash
cd katalon-project
docker-compose up -d
docker ps
```

### Step 2: Install API Dependencies

```bash
cd api
npm install
```

### Step 3: Start REST API

```bash
cd api
npm start
```

API will run on http://localhost:3000

### Step 4: Test API Manually

```bash
curl http://localhost:3000/api/products

curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"AJENG Test Product","price":50000,"category":"Test","stock":10}'

# cmd
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"AJENG Test Product\",\"price\":50000,\"category\":\"Test\",\"stock\":10}"

curl http://localhost:3000/api/products/1
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create new product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/health | Health check |

## Running Katalon Tests

### Option 1: Katalon Studio (GUI)

1. Open Katalon Studio
2. File > Import > Katalon Project
3. Select the Katalon folder
4. Open Test Suites > MainTestSuite
5. Click Run button

### Option 2: Command Line

```bash
katalonc -projectPath="path/to/Katalon" -testSuitePath="Test Suites/MainTestSuite" -mode=console
```

## Kafka Testing

### Test Producer (Standalone)

```bash
cd kafka
node producer.js
```

### Test Consumer (Standalone)

```bash
cd kafka
node consumer.js
```

## Test Cases Overview

### REST API Producer Tests
- TC_01: Create new product
- TC_02: Create multiple products
- TC_03: Update existing product
- TC_04: Delete product

### REST API Consumer Tests
- TC_01: Get all products
- TC_02: Get product by ID
- TC_03: Handle non-existent product
- TC_04: Verify data integrity
- TC_05: Filter by category

### Kafka Consumer Tests
- TC_01: API to Kafka flow
- TC_02: Direct Kafka producer
- TC_03: Consumer start/stop
- TC_04: End-to-end flow

## Troubleshooting

### Kafka not starting
```bash
docker-compose logs kafka
docker-compose down
docker-compose up -d
```

### API not responding
```bash
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Database errors
- SQLite database is created automatically in api/products.db
- Delete the file to reset: rm api/products.db

## Notes

- Database: SQLite (auto-created, no setup needed)
- Kafka: Runs in Docker (port 9092)
- API: Express.js on port 3000
- Events: API sends Kafka events on product create/update/delete
