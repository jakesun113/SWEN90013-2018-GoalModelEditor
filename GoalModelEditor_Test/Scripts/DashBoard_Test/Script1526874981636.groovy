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

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Editor/a_Go to Goal Model Editor'))

WebUI.setText(findTestObject('Dashboard_Series/Page_Sign in/input_username'), 'username4')

WebUI.setText(findTestObject('Dashboard_Series/Page_Sign in/input_password'), '1234')

WebUI.sendKeys(findTestObject('Dashboard_Series/Page_Sign in/input_password'), Keys.chord(Keys.ENTER))

WebUI.click(findTestObject('Dashboard_Series/Page_My Project - Goal Model Editor/div_Untitled'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Return'))

WebUI.click(findTestObject('Dashboard_Series/Page_My Project - Goal Model Editor/div_Untitled'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Functional'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Quality'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Feeling'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Concern'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Actor'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_Next'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_Add'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_Back'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_Upload Image'))

WebUI.uploadFile(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_Upload Image'), '/Users/edric.dang/Desktop/Screen Shot 2018-05-16 at 7.51.53 pm.png')

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_username4'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Sign out'))

WebUI.verifyElementPresent(findTestObject('Modify_User_Profile_Series/Page_Goal Model Editor (1)/a_Go to Goal Model Editor'), 
    30)

WebUI.closeBrowser()

