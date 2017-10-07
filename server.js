var app = require('./app');



var connection = mysql.createConnection({
  host     : 'sql9.freemysqlhosting.net',
  user     : app.get('db_user'),
  password : app.get('db_pass'),
  database : 'sql9197789'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
    connection.query("SELECT * FROM female_life_expectancy_by_zip_code", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });    
} else {
    console.log("Error connecting database ... nn");    
}
});

exports.connection = connection;

// Mongo connection setup

function onSucess() {
  // we're connected!
  console.log('connected to database'); 
  startServer();
}

function onError(error) {
  console.log('connection error:', error); 
}

//db.connect(app.get('dbUrl')).then(onSucess, onError);
startServer();

function startServer() {
  // Start Express
  var server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + server.address().port);
  });

}
