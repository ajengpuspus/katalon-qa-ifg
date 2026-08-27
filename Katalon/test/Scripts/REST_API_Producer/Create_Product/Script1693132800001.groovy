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

// ===== REST API Producer Test =====
// Tests POST endpoints to create/update products

// Step 1: Health Check
WebUI.comment("Step 1: Checking API Health")
def healthResponse = WS.sendRequest(findTestObject('REST API/Health Check'))
assert healthResponse.getStatusCode() == 200 : "API is not running!"

// Step 2: Create Product
WebUI.comment("Step 2: Creating New Product")
def body = JsonOutput.toJson([
    name: "Katalon Test Product",
    price: 75000,
    category: "Electronics",
    stock: 25
])

def request = findTestObject('REST API/Create Product')
request.setHttpBody(body)

def response = WS.sendRequest(request)
WebUI.comment("Response status: " + response.getStatusCode())
WebUI.comment("Response body: " + response.getResponseText())
assert response.getStatusCode() == 201 || response.getStatusCode() == 200 : "Failed to create product! Status: " + response.getStatusCode()

def result = new JsonSlurper().parseText(response.getResponseText())
assert result.success == true
WebUI.comment("✅ Product created with ID: " + result.data.id)

// Step 3: Create Multiple Products
WebUI.comment("Step 3: Creating Multiple Products")
def products = [
    [name: "Product A", price: 100000, category: "Fashion", stock: 50],
    [name: "Product B", price: 200000, category: "Books", stock: 30],
    [name: "Product C", price: 300000, category: "Food", stock: 100]
]

products.each { product ->
    def createBody = JsonOutput.toJson(product)
    def createRequest = findTestObject('REST API/Create Product')
    createRequest.setHttpBody(createBody)
    
    def createResponse = WS.sendRequest(createRequest)
    assert createResponse.getStatusCode() == 201
    WebUI.comment("✅ Created: " + product.name)
}

WebUI.comment("✅ REST API Producer tests passed!")
