# Intelligent Web Assignment
### 1. Installation
This project is aimed at being able to be run in intellij express. It will be able to be ran using the default
intellij express nodejs configuration. 


To install all the required modules
npm install

```bash
npm install
```
To run the mongoDB:
```bash
mongod --dbpath .
```

After running mongo -- To run the server, use the command:
```bash
node ./bin/www
```
node ./bin/www

A browser with SSL flags blocked --> use https://localhost:3000 to access the site

### 2. Contents
The main application code can be found in public/javascripts/app.js.


The main mapping code can be found in public/javascripts/map.js
Click on the map to add a event -- Must add a title -- and submit
click on the blue circle to add a story
comments can be added to the story

The indexeddb code is located in public/javascripts/idb.js, with necessary
configurations located in public/javascripts/interface.js

The main ejs code is found in views/map.ejs

Templates for headier, footer and navigation are found in views/partial
