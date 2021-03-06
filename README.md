# Quality Dashboard

## Introduction

This atlasboard dashboard was made to show the status of a choosen infotel project, considering different keys.

This dashboard is developped with atlasboard, a javascript framework, and is made of widgets, each concerning a specific aspect or software.

The first widget shows *SonarQube*'s relevant metrics, and a graphic of the global evolution of the project regarding to the technical debt. A full part of this widget is dedicated to the test and a graphic enlights the evolution of the project's coverage. It also summarize others figures, as the number of bugs, the complexiy or the violations. Each metric is a link to the *SonarQube* software. If there is an error in one of the tests, the coverage grafic will turn red.

The Second widget summarize *Jira* issues. A summary of the issues numbers, by priorities and status, is above a tab describing all the issues. As in the *SonarQube* widget, a link to the Jira issues is available on the issue description, and in the priorities and status count. It is also possible to add filters to the tab.

In the *Jenkins* widget are displayed the name, status and excecution time of a given job. A link to the job the *Jenkins* software is also available.

The last widget is linked to the *SquashTM* software and displays data on given campaign.


## First Use

### Installation

This dashboard require nodeJS, npm and atlasboard.
Before using your dashboard for the first time, be sure NodeJS and npm are installed.
To install atlasboard, use the command  `npm install -g atlasboard` to have it install globally on your computer.

### Authetification : *globalAuth.json*
At the root of your dashboard, check that the file *globalAuth.json* exist. If it doesn't, but a file name *globalAuth.json.sample* does, just rename it. If there is no file of that name, create your own. 
That file is used for every authentication on the different softwares the dashboard use. Before the first use, and each time you change the user, be sure you update the authentications informations.

If you had to create your own file, here is an example of what it should look like : (it is case sensitive)
```json
	{
		"Jira":{
			"username":"$userName",
			"password":"$password"
		},
		"SonarQube":{
			"username":"$user",
			"password":"$password"
		},
		"Jenkins":{
			"username":"$user",
			"password":"$password"
		},
		"Squash":{
			"username":"$user",
			"password":"$password"
		}
	}
```

**_Warning_**
Your username and password will be save in this file, make sure you erase them before letting anyone use your computer!

### Launch the application
To launch the application, you have to be on the root of the folder and use the command : `atlasboard start $portNumber$`. *(The default portNumber is 3000)*.
The application will be on the adress : _http://localhost:$portNumber$/QualityDashboard_ 

## Modification : __packages\Quality\dashboard\QualityDashboard.json__

### Global configuration

To modify the project you want informations about, you will have to modify on the document *"packages\Quality\dashboard\QualityDashboard.json"* the project in each config.

Be sure you entered the right name for each config. 
### Project Name
This widget is only here to show the project title.

### SonarQube
This config is linked to the *SonarQube* software. Remember to change the project id in _project_.
You may change the metrics you want informations about by adding metric names in _metricList_ or _testList_, the second use for all of the tests metrics and the first for the others. 
If you want to use anything else than the technical debt to see the global avancement, change the metric id in *Avancment*.

### Jira
This is the config linked to the *Jira* software. Remember to change the project id in _project_.
In this config, you may add filters for differents variables :  





#### Version
In the "QualityDashboard.json" file, you can write the name of the version you want informations about on in the "jiraVersionFilter" parameter. You can only choose one, and it will affect the 'fixVersion', the version in wich the issue will be solved.
The default parameter is 'none' : it means that all issues will be shown.
#### Priority, Status and Type

Still in the "QualityDashboard.json" file, you may specify filter for priority, type and status of the issues. Those criteria should be add in the correspondant Filter tab, for example a priopity criterion will be add in the PriorityFilter tab. You may add as many criteria as you wish.
If there is more than one constraint for a same variable (status, type or priority), an issue will be selected if it as a least one of the given criteria.
If there is constraints for more than one variable, an issu will be selected if it correspond to both choices.
The default parameter is empty tab, meaning all issues will be shown, considering this variable.

### Jenkins
This widget display informations on a choosen job.

To have a job displayed, you just have to add it's name on the *configuration file*. The job name is a link to the job on Jenkins.

If the job you want information on does not exist, or if their is no build available, an error will be displayed.

### SquashTM

The last widget of the dashboard is linked to the *SquashTM* software.

For now, the information displayed are only an example, as the API wasn't available at the time.

## Useful Links

[**_Atlasboard_**](https://bitbucket.org/atlassian/atlasboard/wiki/Home)

[**_NodeJS_**](https://nodejs.org/dist/latest-v6.x/docs/api/)

[**_Javascript_**](https://developer.mozilla.org/en-US/docs/Web/JavaScript)