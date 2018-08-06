/**
 * 
 * @author DangTM R&D Department
 * @date Apr 26, 2017
 * @address ELCOM-HCM
 * 
 */
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var Entities = require("html-entities").AllHtmlEntities;
var request = require("request");
var entities = new Entities();
var cheerio = require('cheerio');
var common = require('./common');
var Promise = require('promise');

var Email = function() {
	this.urlConfig = "http://10.5.80.7:8888/WS/system?action=getconfigmail";
}
/**
 * 
 * @param opt =
 *            {from: "xxx@com.vn", to:[mail1, mail2, mail3], cc:[mail1, mail2,
 *            mail3], subject: "", body: "url", priority: "", name: "",
 *            attachments:[file1, file2]}
 * @param callback:
 *            function({status: 1, message: ""}){}
 */
Email.prototype.send = function(opt) {
	console.log(">> Receive data",  opt);
	var data = opt;
	if (typeof (opt) == "string") {
		data = JSON.parse(opt);
	}
	var transporter = nodemailer.createTransport(smtpTransport(data.config));
	var mailFrom = data.from;
	var mailTo = data.to.toString();
	var mailCC = data.cc.toString();
	var html = data.body + data.footer;
	// setup e-mail data with unicode symbols
	var mailOptions = {
		from : mailFrom, 
		to : mailTo,
		cc: mailCC,
		subject : entities.decode(data.subject), 
		html :  html,
		priority : 'NORMAL',
		attachments:[]
	};
	var promise = new Promise((resolve, reject)=>{		
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info) {
			var result;
			if (error) {
				reject(error);
				return;
			}
			resolve(info);
			return;
		});
	});
	return promise;
}

Email.prototype.smtpConfig = function(host, port, user, pass) {
	let promise = new Promise((resolve, reject)=>{
		// get info config mail from DB
		request(this.urlConfig, (error, response, body) =>{
			if(error){
				reject(error);
			}
			body = JSON.parse(body);
			if(body.service.toUpperCase() == "GMAIL"){
				body.config = {
					service: 'gmail',
					host: 'smtp.gmail.com',
					auth: {
						user: body.user,
						pass: body.pass
					}
				}
			} else {
				body.config = {
					host :  body.host,
					port : body.port,
					secure : body.secure,
//					requireTLS:true,
//					secureConnection: false,
					tls : {
						rejectUnauthorized : false,
//						ciphers: "SSLv3"
					},
					//debug: true,
					auth : {
						user : body.user,
						pass : body.pass
					}
				};
			}
			resolve(body); // body object: {service:"GMAIL/OTHER", host:"", port:465, secure: true, user:"mail@domain", pass:"*****", from:"abc@elcom.com.vn", to:["abc@elcom.com.vn","qwerty@elcom.com.vn"], cc:[], subject:"", body:"", footer: "http://footer"}
		});
	});
	return promise;
}
module.exports = new Email();
