Quality Dashboard

				********************
				**  Introduction  **
				********************

This atlasboard dashboard was made to show the status of a choosen infotel project, considering different keys.

This dashboard is develop with atlasboard, a javascript framework.

The dashboard is made of widgets each concerning a specific aspect or software.

The first widget shows SonarQube's relevant metrics, and a graphic of the global evolution of the project regarding to the technical debts. A full part of this widget is dedicated to the test and a graphic enlights the evolution of the project's coverage. 

The Second widget contains Jira issues. It contains the title and vesrion of the project, informations on the issues and a tab with all the issues and for each a link to the Jira server.

In the futur an other widgets will be created to show SquashTM informations. 

				********************
				**    First Use   **
				********************

This dashboard require nodeJS, npm and atlasboard.

Before using your dashboard for the first time, be sure NodeJS and npm are installed.

To install atlasboard, use the command 	
	'npm install -g atlasboard' 
to have it install on your computer.

In the 'globalAuth.json' file, add your password and username for each server. 

To launch the application, you have to be on the root of the folder and use the command :
	'atlasboard start <portNumber>'. 
The default portNumber is 3000.
The application will be on the adress : 
	"http://localhost:<portNumber>/QualityDashboard"


				********************
				**  Modification  **
				********************

##Global configuration

	To modify the project you want informations about, you will have to modify on the document "packages\Quality\dashboard\QualityDashboard.json" the project in each config.

	Be sure you entered the right name for each config. 

##Authetication
	
	In the "globalAuth.json" file at the root of the project, be sure you add your username and password for each server.

##Jira Widget
	
	In this widget, you may choose a version you want informations on. In the "QualityDashboard.json" file, you can write the name of the version in the "jiraVersionFilter" parameter.

	By default, the parameter is 'none' : it means that all issues will be shown.


				********************
				**     Remarks    **
				********************



				********************
				**  Useful Links  **
				********************

..Atlasboard 
	"https://bitbucket.org/atlassian/atlasboard/wiki/Home"

..NodeJS
	"https://nodejs.org/dist/latest-v6.x/docs/api/"

..Javascript
	"https://developer.mozilla.org/en-US/docs/Web/JavaScript"