var express = require("express");
var http = require('http');
var https = require('https');
var fs = require('fs');
var io = require('socket.io');
var path = require('path');

try {
  // root config.json is specific to electron
  var config = require('../config.json');
} catch( err) {
  // local config.json is for node
  var config = require('./config.json');
}



module.exports = function() {
  var app = express();

  const options = {
    key:  fs.readFileSync( path.join(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync( path.join(__dirname, 'ssl', 'server.crt')),
    ca:   fs.readFileSync( path.join(__dirname, 'ssl', 'rootCA.crt')),
    password: 'dodoc',
    requestCert:        true,
    rejectUnauthorized: false
  };

  if( config.protocol === 'http')
    var server = http.createServer(app);
  else if( config.protocol === 'https')
    var server = https.createServer(options, app);

  var io = require("socket.io").listen(server);

  var dodoc = require('./public/dodoc.js');
  var main = require('./main');
  var expressSettings = require('./express-settings');
  var router = require('./router');

  var m = new main(app, io);


  /*
  * Server config
  */
  expressSettings(app, express);

  /**
  * Server routing and io events
  */
  router(app, io, m);


  /**
  * Start the http server at port and IP defined before
  */

  server.listen(
    app.get("port"), function() {
      console.log(`Server up and running. Go to ${config.protocol}://${config.host}:${config.port}`);
    }
  );
}
