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

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Motivational Model Editor/a_Model Editor (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Motivational Model Editor/a_v1.1.0 (1)'))

WebUI.setText(findTestObject('New_dashboard_objects/Page_Sign in/input_username'), 'jordan')

WebUI.setEncryptedText(findTestObject('New_dashboard_objects/Page_Sign in/input_password'), 'aeHFOx8jV/A=')

WebUI.click(findTestObject('New_dashboard_objects/Page_Sign in/button_Sign in'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_RenameDelete'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/a_Delete_1'))

WebUI.waitForElementVisible(findTestObject('New_dashboard_objects/Page_Dashboard - Goal Model Editor/button_Confirm (1)'), 
    30)

WebUI.click(findTestObject('New_dashboard_objects/Page_Dashboard - Goal Model Editor/button_Confirm (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/button_New Project (1)'))

WebUI.waitForElementVisible(findTestObject('Object Repository/New_dashboard_objects/Page_My Project - Goal Model Editor (1)/input_project_name'), 
    30)

WebUI.setText(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/input_project_name (1)'), 
    'try_project')

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_CANCEL (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/button_CREATE (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_Project try_project succes_1 (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_try_projectRenameDelete (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/i_fas fa-plus (1)'))

WebUI.setText(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/input_model_name (1)'), 
    'try_model')

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_CANCEL (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/button_CREATE (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_try_modelSep 16 2018Rename (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_try_model (1)'))

WebUI.click(findTestObject('Object Repository/New_dashboard_objects/Page_Dashboard - Goal Model Editor/div_col-4 text-center project_'))

