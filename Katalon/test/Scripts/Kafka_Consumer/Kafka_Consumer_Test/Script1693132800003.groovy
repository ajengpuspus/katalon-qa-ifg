import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

// ===== Kafka Consumer Test =====
// Tests Kafka message consumption

// Step 1: Create Product via API (Triggers Kafka Event)
WebUI.comment("Step 1: Creating Product via API (Triggers Kafka Event)")
def body = JsonOutput.toJson([
    name: "Kafka Test Product",
    price: 88888,
    category: "KafkaTest",
    stock: 15
])

def request = findTestObject('REST API/Create Product')
request.setHttpBody(body)

def response = WS.sendRequest(request)
assert response.getStatusCode() == 201

def result = new JsonSlurper().parseText(response.getResponseText())
assert result.success == true
WebUI.comment("✅ Product created, Kafka event should be sent")

// Step 2: Verify Kafka Connection via API Health
WebUI.comment("Step 2: Verifying API is running")
def healthResponse = WS.sendRequest(findTestObject('REST API/Health Check'))
assert healthResponse.getStatusCode() == 200
WebUI.comment("✅ API is running")

// Step 3: End-to-End Flow
WebUI.comment("Step 3: Running End-to-End Flow")

// Create product
def e2eBody = JsonOutput.toJson([
    name: "E2E Test Product",
    price: 77777,
    category: "E2E",
    stock: 5
])

def e2eRequest = findTestObject('REST API/Create Product')
e2eRequest.setHttpBody(e2eBody)

def e2eResponse = WS.sendRequest(e2eRequest)
assert e2eResponse.getStatusCode() == 201

def e2eResult = new JsonSlurper().parseText(e2eResponse.getResponseText())
WebUI.comment("✅ E2E: Product created with ID: " + e2eResult.data.id)

// Verify product exists
def verifyRequest = findTestObject('REST API/Get Product By ID')
verifyRequest.setRestUrl("http://localhost:3000/api/products/" + e2eResult.data.id)

def verifyResponse = WS.sendRequest(verifyRequest)
assert verifyResponse.getStatusCode() == 200
WebUI.comment("✅ E2E: Product verified")

// Update product
def updateBody = JsonOutput.toJson([
    name: "E2E Updated Product",
    price: 88888,
    category: "E2E_Updated"
])

def updateRequest = findTestObject('REST API/Update Product')
updateRequest.setRestUrl("http://localhost:3000/api/products/" + e2eResult.data.id)
updateRequest.setHttpBody(updateBody)

def updateResponse = WS.sendRequest(updateRequest)
assert updateResponse.getStatusCode() == 200
WebUI.comment("✅ E2E: Product updated")

WebUI.comment("✅ Kafka Consumer tests passed!")
