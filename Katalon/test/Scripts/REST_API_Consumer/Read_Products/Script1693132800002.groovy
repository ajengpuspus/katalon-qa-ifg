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

// ===== REST API Consumer Test =====
// Tests GET endpoints to read products

// Step 1: Get All Products
WebUI.comment("Step 1: Getting All Products")
def getAllResponse = WS.sendRequest(findTestObject('REST API/Get All Products'))
assert getAllResponse.getStatusCode() == 200

def allProducts = new JsonSlurper().parseText(getAllResponse.getResponseText())
assert allProducts.success == true
assert allProducts.data.size() > 0
WebUI.comment("✅ Found " + allProducts.count + " products")

// Step 2: Get Product By ID
WebUI.comment("Step 2: Getting Product By ID")
def productId = allProducts.data[0].id

def getByIdRequest = findTestObject('REST API/Get Product By ID')
getByIdRequest.setRestUrl("http://localhost:3000/api/products/" + productId)

def getByIdResponse = WS.sendRequest(getByIdRequest)
assert getByIdResponse.getStatusCode() == 200

def product = new JsonSlurper().parseText(getByIdResponse.getResponseText())
assert product.data.id == productId
WebUI.comment("✅ Retrieved product: " + product.data.name)

// Step 3: Test Non-Existent Product
WebUI.comment("Step 3: Testing Non-Existent Product")
def nonExistentRequest = findTestObject('REST API/Get Product By ID')
nonExistentRequest.setRestUrl("http://localhost:3000/api/products/99999")

def nonExistentResponse = WS.sendRequest(nonExistentRequest)
assert nonExistentResponse.getStatusCode() == 404
WebUI.comment("✅ 404 returned correctly")

// Step 4: Verify Data Structure
WebUI.comment("Step 4: Verifying Data Structure")
allProducts.data.each { p ->
    assert p.id != null : "Missing id"
    assert p.name != null : "Missing name"
    assert p.price != null : "Missing price"
    assert p.category != null : "Missing category"
}
WebUI.comment("✅ All products have valid data structure")

WebUI.comment("✅ REST API Consumer tests passed!")
