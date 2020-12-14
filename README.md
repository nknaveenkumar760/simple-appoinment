### First you have to clone the project from git

 Clone the project from Master branch it's updated version

### 'npm install'

Install all dependencies of the project 

### 'npm start'

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Project have some API's given below endpoints

http://127.0.0.1:8081/api/get_event?StartDate=2020-12-16&EndDate=2020-12-17

Type - GET
params - ShortDate
         EndDate

http://127.0.0.1:8081/api/create_event

Type - POST
Body - {
    Datetime
    Duration
}

http://127.0.0.1:8081/api/get_free_slot?Date=2020-12-16&Timezone=Asia/Calcutta

Type - GET
Params - Date
         Timezone


### Short explanations of Your Database and Query design

I have used firestore its a cloud database. i have created a project in firestore and get credentials to access the database. its easy to implement in any project with key.json file . created collection and store some data

Queries are a way of searching for and compiling data from one or more tables. Running a query is like asking a detailed question of your database. When you build a query in Access, you are defining specific search conditions to find exactly the data you want.

I have created a collections with name Events and with the help of api's create event and save data in firestore database with fields -
  Datetime
  Duration

