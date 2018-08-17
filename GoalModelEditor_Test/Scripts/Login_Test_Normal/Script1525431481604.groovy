import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('https://localhost:8080/')

WebUI.click(findTestObject('LoginSeries/Page_Goal Model Editor/a_Go to Goal Model Editor'))

WebUI.setText(findTestObject('LoginSeries/Page_Sign in/input_username'), 'username4')

WebUI.setText(findTestObject('LoginSeries/Page_Sign in/input_password'), '123456')

WebUI.click(findTestObject('LoginSeries/Page_Sign in/button_Sign in'))

WebUI.click(findTestObject('LoginSeries/Page_My File - Goal Model Editor/button_New Project'))

WebUI.click(findTestObject('LoginSeries/Page_My File - Goal Model Editor/div_modal-body'))

WebUI.setText(findTestObject('LoginSeries/Page_My File - Goal Model Editor/input_project_name'), 'new project')

WebUI.click(findTestObject('LoginSeries/Page_My File - Goal Model Editor/button_CREATE'))

WebUI.click(findTestObject('LoginSeries/Page_My File - Goal Model Editor/div_undefinedundefinedundefine'))

WebUI.click(findTestObject('LoginSeries/Page_My File - Goal Model Editor/div_My first goal model'))

WebUI.closeBrowser()

