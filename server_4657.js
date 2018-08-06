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
var email = require('./utils/smtp');
var common = require('./utils/common');
var request = require("request");
var bodyParser = require('body-parser');
var fetch = require("node-fetch");
var Entities = require("html-entities").AllHtmlEntities;
var entities = new Entities();
const PORT = 4657;

app.use(cors());
//parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Router middleware, mentioned it before defining routes.
router.use(function(req,res,next) {
  console.log("/" + req.method, common.getDateTime());
  next();
});
router.get('/', function(req, res){
  res.send("Hello. It's me");
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
router.post('/sendMail', function(req, res){
	var food = req.body.food;
	var room = req.body.room;
	var guest = req.body.guest;
	var status = req.body.cancel; // 0 cancel order
	console.log(room, guest, food, status);
	if(food.length == 0){
		res.status(500).send({status: 0, message: "list food is empty!"});
		return;
	}
	 var txtHTML = '';
	  for(let i = 0; i < food.length; i++){
		  let noNum = "<td><p>" + (i+1) + "</p></td>";
		  let foodName = "<td><p>" + entities.decode(food[i].name) + "</p></td>";
		  let amount = "<td><p>" + food[i].price+ " " + food[i].unit + "</p></td>";
		  let count = "<td><p>" + food[i].count+"</p></td>";
		  let time = "<td><p>" + food[i].order_time+"</p></td>";
		  txtHTML+= "<tr>" + noNum + foodName + count + amount + time+"</tr>";
	  }
	var html = '<p><strong>ROOM:'+room+'<br /></strong><strong>Guest Name:'+guest+'</strong></p><table style="height: 100%; width: 100%;" border="1px">' +
					'<tbody>'+
						'<tr>'+
							'<td style="width: 10%; text-align: left;"><strong>NO</strong></td>'+
							'<td style="width: 30%; text-align: left;"><strong>ORDERED</strong></td>' +
							'<td style="width: auto; text-align: left;"><strong>COUNT</strong></td>'+
							'<td style="width: auto; text-align: left;"><strong>AMOUNT</strong></td>'+
							'<td style="width: auto; text-align: left;"><strong>ORDER TIME</strong></td>'+
						'</tr>' 
					+ txtHTML
					+ '</tbody></table>';
	if(status == 1){
		html = '<p><span style="background-color: #ffffff; color: #ff0000;"><strong>Th&ocirc;ng tin order b&ecirc;n dưới đ&atilde; hủy</strong></span></p>' + html;
	}
	email.smtpConfig().then((result)=>{
		if(result.footer != ""){
			request(result.footer,(error, response, body)=>{
				result.footer = body;
				result.body = html;
				return email.send(result);
			});
		} else {
			return email.send(result);
		}
	}, err=>{
		console.log(err);
		res.status(500).send({status: 0, message: "Can not get config"});
	}).then(result=>{
		console.log(result);
		res.status(200).send({status: 1, message: "Success"});
	}, err=>{
		console.log(err);
		res.status(500).send({status: 0, message: "Send mail fail"});
	})
});

app.use('/', router);

// Handle 404 error. 
// The last middleware.
app.use("*",function(req,res){
  res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});

var server = app.listen(PORT, function(){
  console.log('Server listening on port', server.address().port);
});
