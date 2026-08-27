# Katalon Test Project - Kafka API Testing

## Project Structure

```
test/
├── Test Cases/
│   ├── REST_API_Producer/
│   │   └── Create_Product.ts          # Tests POST endpoints
│   ├── REST_API_Consumer/
│   │   └── Read_Products.ts           # Tests GET endpoints
│   └── Kafka_Consumer/
│       └── Kafka_Consumer_Test.ts     # Tests Kafka integration
├── Test Suites/
│   └── MainTestSuite.test-suite       # Runs all tests
├── Object Repository/
│   └── REST API/
│       ├── Health Check.request
│       ├── Get All Products.request
│       ├── Get Product By ID.request
│       ├── Create Product.request
│       └── Update Product.request
├── Keywords/
│   └── com/katalon/kafka/
│       └── KafkaHelper.groovy         # Custom Kafka keywords
└── Profiles/
    └── default.glbl
```

## How to Run Tests

### Option 1: Run Individual Test Case
1. Open Katalon Studio
2. Navigate to `Test Cases`
3. Right-click on a test case → `Run`

### Option 2: Run Test Suite
1. Open `Test Suites/MainTestSuite`
2. Click the ▶️ Run button

### Option 3: Command Line
```bash
katalonc -projectPath="D:\_ajeng\katalon\Katalon\test" \
         -testSuitePath="Test Suites/MainTestSuite" \
         -mode=console
```

## Prerequisites

1. **Kafka Docker** running:
   ```bash
   docker-compose up -d
   ```

2. **REST API** running:
   ```bash
   cd D:\_ajeng\katalon\api
   npm start
   ```

## Test Cases Overview

### REST API Producer (Create_Product.ts)
- ✅ Health Check
- ✅ Create New Product (POST)
- ✅ Verify Product Exists
- ✅ Create Multiple Products

### REST API Consumer (Read_Products.ts)
- ✅ Get All Products (GET)
- ✅ Get Product By ID
- ✅ Handle Non-Existent Product (404)
- ✅ Verify Data Structure
- ✅ Filter By Category

### Kafka Consumer (Kafka_Consumer_Test.ts)
- ✅ Create Product (Triggers Kafka Event)
- ✅ Send Direct Kafka Message
- ✅ Verify Kafka Connection
- ✅ End-to-End Flow

## Custom Keywords

### KafkaHelper
- `sendMessage(topic, message)` - Send message to Kafka
- `sendJsonMessage(topic, map)` - Send JSON message
- `testConnection()` - Test Kafka connection

## Troubleshooting

### API Not Running
```bash
curl http://localhost:3000/api/health
```

### Kafka Not Running
```bash
docker ps | grep kafka
docker-compose logs kafka
```

### Test Fails to Import
Make sure you create a new Katalon project first, then copy these files.
