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

WebUI.click(findTestObject('RegisterSeries/Page_Goal Model Editor/a_Go to Goal Model Editor'))

WebUI.click(findTestObject('RegisterSeries/Page_Sign in/a_Register'))

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_username'), 'username5')

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_lastname'), 'lastname5')

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_email'), 'dsy502yc@gmail.com')

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_firstname'), 'firstname5')

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_password'), '1234')

WebUI.setText(findTestObject('RegisterSeries/Page_Registration/input_confirmPassword'), '1233')

WebUI.click(findTestObject('RegisterSeries/Page_Registration/button_Submit'))

WebUI.mouseOver(findTestObject('RegisterSeries/Page_Registration/li_Password not the same pleas'))

WebUI.closeBrowser()

