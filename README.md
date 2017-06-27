Quality Dashboard

				********************
				**  Introduction  **
				********************

This atlasboard dashboard was made to show the status of a choosen infotel project, considering different keys.

This dashboard is develop with atlasboard, a javascript framework.

The dashboard is made of widgets each concerning a specific aspect or software.

The first widget shows SonarQube's relevant metrics, and a graphic of the global evolution of the project regarding to the technical debts. A full part of this widget is dedicated to the test and a graphic enlights the evolution of the project's coverage. 

In the futur two more widgets will be created to show Jira and SquashTM informations. 

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

To modify the project you want informations about, you will have to modify on the document "packages\Quality\dashboard\QualityDashboard.json" the project in "projectName" and "SonarQube". 


				********************
				**     Remarks    **
				********************

The place of the widget may be modified directly on the application. However be carefull not to throw some out of the screen.

				********************
				**  Useful Links  **
				********************

..Atlasboard 
	"https://bitbucket.org/atlassian/atlasboard/wiki/Home"

..NodeJS
	"https://nodejs.org/dist/latest-v6.x/docs/api/"

..Javascript
	"https://developer.mozilla.org/en-US/docs/Web/JavaScript"