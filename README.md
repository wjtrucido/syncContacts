# syncContacts
Sync
# SyncMailchimp backend.
# It is necessary to have Nodejs installed.
If you do not have it you can visist the url and download Nodejs:
https://nodejs.org/en

# Installation and execution steps:

1- In your operating system create a working directory and open a new terminal in this directory.

2- Git clone: https://github.com/wjtrucido/syncContacts.git

3- cd syncMailchimp

4- npm install

5- In the project there is an example .env file called .env-example.
   Rename ".env-example" to ".env".
   This file contains the following variables, which we must fill in.
   It is necessary to configure the database and the .env file; this project implements a MongoDB database through the Mongo Atlas service        	(https://www.mongodb.com/atlas/database), so you must create an account in this service to obtain the necessary variables:
	 username
	 password
	 These variables will be passed as parameters in the value of the variable 'MONGODB_URI',
	 Example: 
	 MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.enld7bq.mongodb.net/?retryWrites=true&w=majority

6- You must also create an account in MailChimp to obtain the variables:
	 listId
	 apiKey
 
7- Use PORT = 5002 in the .env file.

8- Important: In the mongo atlas account, specifically in the 'Network access' section, the current IP must be added to the authorized list, otherwise the connection to the service cannot be established.

9- In the win terminal run the command: npm run start-all

*** You are done !!!, use the following frontend to connect,
in the repo there is a README file with instructions.
https://github.com/wjtrucido/syncContactsFrontend

####################################################################################
