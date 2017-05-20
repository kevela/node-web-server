const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//object that stores env vars as key value pairs
const port = process.env.PORT || 3000;
var app = express();

//give location to partials we're going to use
hbs.registerPartials(__dirname + '/views/partials');

//set express related configurations
app.set('view engine', 'hbs');

//Middleware to keep track of how server is working. Just writes to a log file
//Request has all the info from whatever client is accessing the site
//needs to call next() in order to proceed
//Goes in order of file execution
app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}: ${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
        console.log('Unable to append to server.log');
    }
  });
  next();
});

// //Middleware to send someone to maintenance page
// app.use((request, response, next) => {
//   response.render('maintenance.hbs');
// });

//register middleware
//static() takes absolute path to folder we want to serve up.
//__dirname stores path to project directory
//point to public folder in this directory
app.use(express.static(__dirname + '/public'));

//inject a function into our hbs files
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

//when calling this function from hbs file, syntax is {{methodName parameter1 parameter2}}
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//return something when someone views the root directory of app
app.get('/', (request, response) => {
  //res.send('<h1>Hello Express!<h>');
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcome: 'Hello. Good to see you again.'
  });
});
//second parameter of render() will take in an object with key value pairs to
//dynamically display values in about.hbs
app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

//Render Projects page
app.get('/projects', (request, response) => {
    response.render('projects.hbs', {
      pageTitle: 'Projects Page',
      message: 'Future projects to be added here.'
    });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage: 'Request failed because reasons'
  });
});

//using environment variable with Heroku
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
;});
