var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var fs = require('fs');
var cors = require("cors");
var common = require('core-common');
var bodyParser = require('body-parser');
var file = require('core-file');
var soap = require('soap');
var request = require('request');
var service = require('./router');
var wsdl = "http://localhost:1236/ws/esmile?wsdl";
var wsdl_tablet = "http://localhost:1235/ws/esmile?wsdl"; 
var path_content = "/data/media/Image/esmile/";

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// middleware handle
router.use(function(req,res,next) {
  console.log("/" + req.method, req.originalUrl, common.getDateTime());
  res.header("Content-Type",'application/json');
  next();
});
router.get('/', function(req, res){
  res.send("SERVICE 3000 RUNNING...");
});
app.post('/upload', function(req, res){
	file.upload(req, res);
});
app.get('/content/*', function(req, res) {
   var url = req.url.match('^[^?]*')[0].replace('/content/','');
   common.log(path.join(path_content, url));
   res.sendFile(path.join(path_content, url));
});

app.use('/api', service); 
app.use('*', router); 
// Handle 404 error.
// The last middleware.
app.use("*",function(req,res){
  res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});

var server = app.listen(3000, function(){
  console.log('Server listening on port', server.address().port);
});
