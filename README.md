<h3>What it does:</h3>
This application is designed to let users see all the public bills for the current Utah legislative session in a grid format to make searching, sorting, etc. easier.
The application was originally written in 2023 using queries with direct access to the various databases within the legislature.  This version of the application 
has been refactored to use the Utah Legislature's API.  The application will also allow you to create your own tracking lists based on a topics.  This feature
relies on the browsers local storage, so if you're going to use it I would recommend a browser that doesn't updated very often (eg Safari or Firefox) because
Chrome seems to update pretty often and local storage seems to get wiped.

<h3>How it works:</h3>
Once the application starts, it will create a directory in the users home folder called "billboard". It will then create a Sqlite database used for logging basic
method/job information as well as processing durrations, so that problematic issues can be detected easily. The app will then call the API to fetch some 
supporting data sets (legislators.json, committees.json, missingelements.json). These data sets will be updated via cron jobs based on how often they need to be 
checked.  The main data set (bills.json) will be checked an updated every 15 minutes from December through March, and then once per day otherwise. 

<h4>Technology Stack:</h4>
<ol> 
  <li>Springboot 3.4.8</li>
  <li>ReactJS 18.2.0</li>
  <li>PrimeReact 10.0.9</li>
  <li>MyBatis 3.0.4</li>
</ol>

<h4>Note:</h4>
If you would like to run the application locally you will need to sign up for a developer
account (on https://le.utah.gov) and acquire a developer's token.  Once you do that you can 
setup an environment variable for "api.key" in your IDE, or you can simply add the token to 
the application.properties file.
