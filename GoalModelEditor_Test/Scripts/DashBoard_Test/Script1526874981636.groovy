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

WebUI.navigateToUrl('https://localhost:8080/login')

WebUI.setText(findTestObject('LoginSeries/Page_Sign in/input_username'), 'username4')

WebUI.setText(findTestObject('LoginSeries/Page_Sign in/input_password'), '123456')

WebUI.sendKeys(findTestObject('LoginSeries/Page_Sign in/input_password'), Keys.chord(Keys.ENTER))

WebUI.click(findTestObject('Dashboard_Series/Page_My Project - Goal Model Editor/div_Untitled'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/a_Return'))

WebUI.click(findTestObject('Dashboard_Series/Page_My Project - Goal Model Editor/div_Untitled'))

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/a_Functional'))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_F_1'), 'try functional goal')

WebUI.sendKeys(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_F_1'), Keys.chord(Keys.ENTER))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_F_2'), 'try another one')

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/a_Quality'))

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/a_Feeling'))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_E_1'), 'try new')

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/a_Concern'))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_N_1'), 'try new goal')

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/a_Actor'))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_S_1'), 'try new actor')

WebUI.sendKeys(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_S_1'), Keys.chord(Keys.ENTER))

WebUI.setText(findTestObject('ClusterSeries/Page_Goal Model Edit Page/input_S_2'), 'try another actor')

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/div_goals'))

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/button_Next'))

WebUI.click(findTestObject('ClusterSeries/Page_Goal Model Edit Page/button_Back'))

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page (1)/button_Upload Image'))

WebUI.uploadFile(findTestObject('Dashboard_Series/Page_Goal Model Edit Page (1)/button_Upload Image'), '/Users/edric.dang/Desktop/Screen Shot 2018-05-16 at 7.51.53 pm.png')

WebUI.click(findTestObject('Dashboard_Series/Page_Goal Model Edit Page/button_username4'))

WebUI.click(findTestObject('Page_Goal Model Edit Page/a_Sign out'))

WebUI.closeBrowser()

