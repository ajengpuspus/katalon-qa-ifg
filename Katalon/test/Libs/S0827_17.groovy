import com.kms.katalon.core.logging.KeywordLogger
import com.kms.katalon.core.exception.StepFailedException
import com.kms.katalon.core.reporting.ReportUtil
import com.kms.katalon.core.main.TestCaseMain
import com.kms.katalon.core.testdata.TestDataColumn
import com.kms.katalon.core.testcase.TestCaseBinding
import com.kms.katalon.core.driver.internal.DriverCleanerCollector
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.configuration.RunConfiguration
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData


import com.katalon.execution.application.ExecutionMain

Map<String, String> suiteProperties = new HashMap<String, String>();

suiteProperties.put('rerunTestFailImmediately', 'true')
suiteProperties.put('retryCount', '3')
suiteProperties.put('name', 'MainTestSuite-new')
suiteProperties.put('description', '')
suiteProperties.put('id', 'Test Suites/MainTestSuite-new')
 

DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.webui.contribution.WebUiDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.mobile.contribution.MobileDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.cucumber.keyword.internal.CucumberDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.windows.keyword.contribution.WindowsDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.llm.keyword.contribution.LlmDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.testng.keyword.internal.TestNGDriverCleaner())



RunConfiguration.setExecutionSettingFile("D:\\_ajeng\\katalon\\Katalon\\test\\Reports\\20260827_224316\\MainTestSuite-new\\20260827_224316\\execution.properties")

TestCaseMain.beforeStart()

new ExecutionMain().init();

TestCaseMain.startTestSuite('Test Suites/MainTestSuite-new', suiteProperties, new File("D:\\_ajeng\\katalon\\Katalon\\test\\Reports\\20260827_224316\\MainTestSuite-new\\20260827_224316\\testCaseBinding"))
