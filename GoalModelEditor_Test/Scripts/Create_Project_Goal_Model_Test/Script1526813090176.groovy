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

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Goal Model Editor (3)/a_Go to Goal Model Editor'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_username'), 'username4')

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_password'), '1234')

WebUI.sendKeys(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_password'), Keys.chord(Keys.ENTER))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (3)/button_username4'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (3)/a_Sign out'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Goal Model Editor (3)/a_Go to Goal Model Editor'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_username'), 'u')

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_username'), 'username4')

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/input_password'), '1234')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/label_Remember me (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Sign in (3)/button_Sign in (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (3)/button_New Project'))

WebUI.waitForElementVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'), 
    30)

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'), 
    'hahaha')

WebUI.clearText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/label_Project Name'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/input_project_name'), 'New_Project_Name_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/div_Project Name (1)'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/input_model_name (1)'), 'New_Goal_Model_Name_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/button_CREATE (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/div_New_Goal_Model_Name_Test (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Goal Model Edit Page (1)/strong_Goal Model (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Goal Model Edit Page (1)/a_Return (1)'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (3)/button_New Project'))

WebUI.waitForElementVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'), 
    30)

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'), 
    'hahaha')

WebUI.clearText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/input_project_name'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/label_Project Name'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/input_project_name'), 'New_Project_Name_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/div_Project Name (1)'))

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/input_model_name (1)'), 'New_Goal_Model_Name_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor/button_CREATE (1)'))

WebUI.waitForAlert(0)

WebUI.acceptAlert()

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (5)/button_CANCEL'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (5)/button_CANCEL'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementHasAttribute(findTestObject('rename-project'), '', 0)

WebUI.click(findTestObject('rename-project'), FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'), 
    30)

WebUI.focus(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'))

WebUI.clearText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (13)/button_CANCEL'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementAttributeValue(findTestObject('rename-project'), '', '', 0)

WebUI.click(findTestObject('rename-project'))

WebUI.waitForElementVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'), 
    0)

WebUI.focus(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (15)/input_model_name'), 
    'New_Model_Add_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (13)/button_CREATE'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (14)/div_New_Model_Add_Test'))

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_Goal Model Edit Page (3)/a_Return'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementHasAttribute(findTestObject('CreateProjectGoalModelSeries/rename-project1'), '', 0)

WebUI.click(findTestObject('CreateProjectGoalModelSeries/rename-project1'), FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (16)/input_project_name'), 
    0)

WebUI.focus(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (16)/input_project_name'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.setText(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (16)/input_project_name'), 
    'Project_Rename_Test')

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (16)/button_Confirm'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.waitForElementHasAttribute(findTestObject('CreateProjectGoalModelSeries/delete-project'), '', 0)

WebUI.click(findTestObject('CreateProjectGoalModelSeries/delete-project'))

WebUI.mouseOver(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (16)/lable_You would lose all goal'))

WebUI.waitForElementPresent(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (18)/button_Confirm'), 
    30, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (18)/button_Confirm'))

WebUI.waitForElementClickable(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (18)/button_Confirm'), 
    0)

WebUI.click(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (18)/button_Confirm'))

WebUI.verifyElementNotVisible(findTestObject('CreateProjectGoalModelSeries/Page_My Project - Goal Model Editor (1)/div_New_Goal_Model_Name_Test'), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.closeBrowser()

