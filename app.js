var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv');
dotenv.load();

var config = require('config');
var mysql = require('mysql');


//var exercise = require('./routes/ExerciseRoute');


// =============================================================================
// Express CONFIGURATION
// =============================================================================

var app = express();

var httpPort = config.get('port');
app.set('port', process.env.PORT || httpPort);

app.set('db_user', process.env.db_user);
app.set('db_pass', process.env.db_pass);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// =============================================================================
// DB CONFIGURATION
// =============================================================================


var connection = mysql.createConnection({
  host     : 'sql9.freemysqlhosting.net',
  user     : app.get('db_user'),
  password : app.get('db_pass'),
  database : 'sql9199405'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");  
      startServer(); 
  } else {
      console.log("Error connecting database ... nn");    
  }
});


function startServer() {
  // Start Express
  var server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + server.address().port);
  });

}


app.get('/calculate', function (req, res) {
  console.log(req.query);
  try {
    var query = "SELECT "+ req.query.age +" FROM "+ req.query.gender +"_life_expectancy_by_zip_code WHERE zip="+ req.query.zipCode+ '.0';
    console.log(query);
    connection.query(query , function (err, result, fields) {
    if (err) res.json('error');
    if(result.length >0)
      res.json(result[0][req.query.age]);
    else
      res.json('error');
  }); 

  } catch(err) {
    res.json('error');
  }
  
  //res.send('error');
});

function mapColumns(columns) {
  columns.splice(0,1);
  var result = columns.map((value) => value.Field);
  console.log(result);
  return result;
}

app.get('/age', function (req, res) {
  console.log(req.query);
  var columns = [];
  connection.query("SHOW COLUMNS FROM "+ req.query.gender +"_life_expectancy_by_zip_code", function (err, result, fields) {
    if (err) res.json('error');
    columns = mapColumns(result);
    res.send(columns);
  }); 
  
  //res.send('error');
});


function mapZip(zips) {
  var result = zips.map((value) => value.zip);
  console.log(result);
  return result;
}

app.get('/zipcode', function (req, res) {
  console.log(req.query);

  try {
    var query = "SELECT zip FROM "+ req.query.gender +"_life_expectancy_by_zip_code";
    console.log(query);
    connection.query(query , function (err, result, fields) {
    if (err) res.json('error');


    res.json(mapZip(result));

  }); 

  } catch(err) {
    res.json('error');
  }
  
  //res.send('error');
});




// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
