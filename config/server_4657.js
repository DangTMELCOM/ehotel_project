/**
 * 
 * @author DangTM R&D Department
 * @date May 7, 2017
 * @addr ELCOM-HCM
 * 
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var fs = require('fs');
var cors = require("cors");
var dir = require('node-dir');
var request = require('request');
var mv = require('mv');
var email = require('./smtp');
var common = require('core-common');
var mailList = '/home/itm01/mail_list.json';
var Entities = require("html-entities").AllHtmlEntities;
var request = require("request");
var entities = new Entities();

app.use(cors());

// Router middleware, mentioned it before defining routes.
router.use(function(req,res,next) {
  console.log("/" + req.method, common.getDateTime());
  next();
});
router.get('/', function(req, res){
  res.send("Hello. It's me");
});
router.get('/mail', function(req, res){
  res.sendFile(mailList);
});
router.get('/delete', function(req, res){
	var name = req.query.name;
	console.log('--> ' + name);
	if (!fs.existsSync(name)){
		var obj = {success:0, error: 1};
		res.setHeader('Content-type', 'application/json');
		res.charset = 'UTF-8';
		res.send(obj);
	} else {
	    fs.unlink(name);
	    console.log('File delete success');
	    var obj = {success: 1, error: 0};
		res.setHeader('Content-type', 'application/json');
		res.charset = 'UTF-8';
		res.send(obj);
	}
	
});

// api list file in folder
router.get('/dir', function(req, res){
	var pathFolder = req.query.path;
	console.log(path.join(pathFolder,''));
	if(fs.existsSync(pathFolder)){
		dir.files(path.join(pathFolder,''), function(err, files) {
		    if (err) throw err;
		    console.log(files);
		    res.setHeader('Content-type', 'application/json');
			res.charset = 'UTF-8';
		    res.send(files);
		});
	} else {
		res.setHeader('Content-type', 'application/json');
		res.charset = 'UTF-8';
		var obj = {error:'path not exist. please check again'};
	       res.send(obj);
	}
	
});
router.get('/sendMail', function(req, res){
	request.get('http://localhost:3000/api/mobile/notify', function(error, response, body){
		  console.log("Send SMILE");
		  if(error){
			  common.log(error);
			  return;
		  }
		  let arrReceive = JSON.parse(body).data;
		  let length = arrReceive.length;
		  if(length == 0){
			  common.log('DATABASE NOT RECEIVE DATA');
			  res.send({status: 1, message: "DATABASE NOT RECEIVE DATA"});
			  return;
		  }
		  var txtHTML = '';
		  for(let i = 0; i < length; i++){
			  let room = "<td><p>" + arrReceive[i].folio + "</p></td>";
			  let guest = "<td><p>" + entities.decode(arrReceive[i].guest) + "</p></td>";
			  let rating = "<td><p>" + entities.decode(arrReceive[i].name)+"</p></td>";
			  txtHTML+= "<tr>" + room + guest + rating +"</tr>";
		  }
		var table = '<table style="height: 100%; width: 100%;" border="1px"><tbody><tr><td style="width: 10%; text-align: left;"><strong>ROOM NO</strong></td><td style="width: 13%; text-align: left;"><strong>GUEST</strong></td><td style="width: 30%; text-align: left;"><strong>APPRISAL</strong></td></tr>' 
						+ txtHTML
						+ '</tbody></table>';
		var obj = JSON.parse(fs.readFileSync(mailList, 'utf8'));
		var data = {
			from: obj.from,
			to: obj.to,
			cc: obj.cc,
			subject: obj.subject,
			html: table
		}
		email.send(data, function(response){
			request.get({url: 'http://localhost:3000/api/mobile/notify/delete', qs:{id:[-1]}}, 
				function(error, res, body){
					if(error){
						console.log("Request error");
					} else {
						common.log(body);
					}
				});
			res.send(response);
		});
		
	
	});
});
router.get('/surveyMail', function(req, res){
	request.get('http://localhost:3000/api/mobile/notify', function(error, response, body){
		  console.log("Send Survey");
		  if(error){
			  common.log(error);
			  return;
		  }
		  let arrReceive = JSON.parse(body).data;
		  let length = arrReceive.length;
		  if(length == 0){
			  common.log('DATABASE NOT RECEIVE DATA');
			  res.send({status: 1, message: "DATABASE NOT RECEIVE DATA"});
			  return;
		  }
		  var txtHTML = '';
		  for(let i = 0; i < length; i++){
			  var txt = arrReceive[i].name;
			  var arr = txt.split(" ");
			  var attitude = "";
			 
			  if(arr.length > 1){
				  attitude = arr.pop();
				  txt = arr.join().replace(/,/g , " ");
			  }
			  let room = "<td><p>" + arrReceive[i].folio + "</p></td>";
			  let guest = "<td><p>" + entities.decode(arrReceive[i].guest) + "</p></td>";
			  let rating = "<td><p>" + entities.decode(txt) +"</p></td>";
			  let att = "<td><p>" + entities.decode(attitude) +"</p></td>";
			  txtHTML+= "<tr>" + room + guest + rating + att +"</tr>";
		  }
		var table = '<table style="height: 100%; width: 100%;" border="1px"><tbody><tr><td style="width: 10%; text-align: left;"><strong>ROOM NO</strong></td><td style="width: 13%; text-align: left;"><strong>GUEST</strong></td><td style="width: 30%; text-align: left;"><strong>APPRISAL</strong></td><td style="width: 10%; text-align: left;"><strong>ATTITUDE</strong></td></tr>' 
						+ txtHTML
						+ '</tbody></table>';
		var obj = JSON.parse(fs.readFileSync(mailList, 'utf8'));
		var data = {
			from: obj.from,
			to: obj.to,
			cc: obj.cc,
			subject: obj.subject,
			html: table
		}
		email.send(data, function(response){
			request.get({url: 'http://localhost:3000/api/mobile/notify/delete', qs:{id:[-1]}}, 
				function(error, res, body){
					if(error){
						console.log("Request error");
					} else {
						common.log(body);
					}
				});
			res.send(response);
		});
		
	
	});
});
router.post('/sendMail', function(req, res){
	var data = req.param('data');
	email.send(data, function(response){
		res.send(response);
	});
});

app.use('/', router);

// Handle 404 error. 
// The last middleware.
app.use("*",function(req,res){
  res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});

var server = app.listen(4657, function(){
  console.log('Server listening on port', server.address().port);
});
