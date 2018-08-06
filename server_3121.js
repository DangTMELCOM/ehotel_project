/**
@author DangTM
12/05/2016
**/
var express = require("express");
var request = require('request');
var common    = require("core-common");
var app     = express();
var path    = require("path");
var cors = require("cors");
var  cheerio = require('cheerio');
var urlRoot = require('url');
var bodyparser = require('body-parser');
var path_source = "/core/ehotel/service/app/ehotel_modules/eHotelSTB";
var path_content = "/data/media/";
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors());
app.use('/ehotel', express.static(path.join(path_source, '/')));
app.use('/', express.static(path.join(path_source, '/')));

app.get('/ehotel',function(req,res){
  res.sendFile(path.join(path_source,'index.html'));
});
app.post('/upload', function(req, res){
	file.upload(req, res);
});
app.get('/sychronizeTime', function(req, res){
	console.log("--> Sychronize Time ", common.getTime());
	res.send(common.getTime()); //common.getTime()
});
app.get('/ehotel/sychronizeTime', function(req, res){
	console.log("--> Sychronize Time ", common.getTime());
	res.send(common.getTime()); //common.getTime()
});
app.get('/content/*', function(req, res){
   var url = req.url.match('^[^?]*')[0].replace('/content/','');
   res.sendFile(path.join(path_content, url));
});
app.get('/logs', function(req, res){
	console.log(common.getDateTime(), "--> DangTM logger >>>> " + req.query.message);
	res.send('OK'); 
});
app.get('/getHTML', function(req, res){
	var url = req.query.url;
	var arg = urlRoot.parse(url).path.split('/');
	var subPath = urlRoot.parse(url).path.replace(arg[arg.length -1], '');
	var domain = 'http://' + urlRoot.parse(url).host;
	console.log('>>> Request URL:', url);
	request.get(url, 
			function(error, response, body){
		if(error){
			res.setHeader('Content-Type', 'text/html');
			res.sendFile(path.join(path_source,'ELCommon/404/404.html'));
		} else {
			res.charset = 'UTF-8';
			body = body.replace(/href="/g, 'href="'+domain + subPath);
			body = body.replace(/script src="/g, 'script src="'+domain + subPath);
			//body = body.replace(/img src="../g, 'img src="'+domain + '/Image');
			body = body.replace(/img src="/g, 'img src="'+domain);
			res.setHeader('Content-Type', 'text/html');
			res.send({data:body, error: 0});
		}
    });
});
app.get('/languages/text/:code', function(req, res){
	var code = req.params.code;
	res.charset = 'UTF-8';
	res.sendFile(path.join(path_source,'ELCommon/language/text_' + code + '.json'));
});
var server = app.listen(3121, function(){
	console.log('Server listening on port ' + server.address().port);
});
