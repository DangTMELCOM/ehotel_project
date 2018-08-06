var express = require('express');
var router = express.Router();
var path = require('path');
var common = require('core-common');
var soap = require('soap');


var wsdl = "http://172.18.18.10:1236/ws/esmile?wsdl";
var wsdl_tablet = "http://172.18.18.10:1235/ws/esmile?wsdl";
var path_content = "/data/media/Image/esmile/";


// middleware handle
router.use(function(req,res,next) {
  console.log("/" + req.method, req.originalUrl, common.getDateTime());
  res.header("Content-Type",'application/json');
  next();
});
router.get('/', function(req, res){
  res.send("SERVICE 3000 RUNNING...");
});
router.get('/content/*', function(req, res) {
   var url = req.url.match('^[^?]*')[0].replace('/content/','');
   common.log(path.join(path_content, url));
   res.sendFile(path.join(path_content, url));
});
router.post('/login', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err)
			console.error(err);
		else {
			var username = req.body.username;
			var password = req.body.password;
			var args = {"arg0": JSON.stringify({username:username, password:password})};
			client.getLogin(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
		}
	});
});

router.get('/location', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err)
			console.error(err);
		else {
			client.getLocation({}, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			}) 
		}
	});
});
router.get('/smile', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err)
			console.error(err);
		else {	
			var json = {
				date_from: req.query.date_from, 
				date_to: req.query.date_to, 
				location: req.query.location,
				lang_id: req.query.lang_id
			}
			common.log(JSON.stringify(json));
			var args = {"arg0": JSON.stringify(json)};
			client.getSmile(args, function(err, result) { 
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
		}
	});
});
router.get('/statistic', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			// check input
			if(req.body.location != "" &&  req.body.date_from != "" 
				&& req.body.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getStatistic(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
});
router.get('/rating', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			// check input
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					smile_id: req.query.smile_id,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getRating(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
});
router.get('/rating/statistic', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		} 
		else {
			// check input
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getRatingDivision(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
});
router.get('/rating/all', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			// check input
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getAllRating(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
});

router.get('/background', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {};
			client.getBackground(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/background/:name/:id', function(req, res){
	var id = req.params.id;
	var name = req.params.name;
	var args = {'arg0': JSON.stringify({id: id})};
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			if(name == 'add'){
				var url = req.params.id; // name image
				var args = {'arg0': JSON.stringify({url: url})};
				client.addBackground(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else if(name == 'edit'){
				var args = {'arg0': JSON.stringify({id: id})};
				client.editBackground(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else if(name == 'delete'){
				var args = {'arg0': JSON.stringify({id: id})};
				client.deleteBackground(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
	
});
router.get('/promotion', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {};
			client.getPromotion(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/promotion/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {arg0: JSON.stringify({name: req.query.name, url_content: req.query.url, url_image: req.query.image})};
			client.addPromotion(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			 
		}
	});
});
router.get('/promotion/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);  
		}
		else {
			var args = {arg0: JSON.stringify({id: req.query.id, name: req.query.name, url_content: req.query.url, url_image: req.query.image})};
			client.editPromotion(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				} 
			})
			
		}
	});
});
router.get('/promotion/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {arg0: JSON.stringify({id: req.params.id})};
			client.deletePromotion(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return); 
				}
			})
			
		}
	});
});
/**
 * Info
 */
router.get('/info/subject', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getSubjectInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/subject/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {name: req.query.name, image: req.query.image};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addSubjectInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/subject/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image, langid: req.query.langid, invisible: req.query.invisible, index: req.query.index};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSubjectInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/subject/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteSubjectInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
/**
 * Item subject info
 */
router.get('/info/item', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getContentInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/item/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, url: req.query.url};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addContentInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/item/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {
					id: req.query.id, 
					name: req.query.name, 
					url: req.query.url, 
					langid: req.query.langid, 
					invisible: req.query.invisible
			};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editContentInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/info/item/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {
					id: req.params.id, 
			};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteContentInfo(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
/**
 * menu
 * 
 */
router.get('/menu', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			try{
				var parameter = {langid: req.query.langid};
				common.log(parameter);
				var args = {arg0: JSON.stringify(parameter)};
				client.getService(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
				
			} catch(err){
				res.send(JSON.stringify({status: '-1', message: 'ERROR from FUNCTION'}));
			}
			
			
		}
	});
});
router.get('/menu/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			try{
				var parameter = {langid: req.query.langid, name: req.query.name, status: req.query.status, image: req.query.image};
				common.log(parameter);
				var args = {arg0: JSON.stringify(parameter)};
				client.addService(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
				
			} catch(err){
				res.send(JSON.stringify({status: '-1', message: 'ERROR from FUNCTION'}));
			}
			
			
		}
	});
});
router.get('/menu/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image, langid: req.query.langid, status: req.query.status, index: req.query.index};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editService(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/menu/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteService(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

/**
 * dining subject
 * 
 */
router.get('/dining/subject', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getSubjectDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/dining/subject/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {name: req.query.name, image: req.query.image};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getMenu(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/dining/subject/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getMenu(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/dining/subject/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getMenu(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

/**
 * dining item
 * 
 */
router.get('/dining/item', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, langid: req.query.langid};
			var args = {arg0: JSON.stringify(parameter)};
			common.log(args);
			client.getSubjectDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/dining/item/add', function(req, res){
	soap.createClient(wsdl, function(err, client) { 
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image, invisible: req.query.invisible, index: req.query.index};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addSubjectDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/dining/item/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image, invisible: req.query.invisible, index: req.query.index, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSubjectDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/dining/item/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteSubjectDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});


router.get('/food', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getItemDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/food/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, image: req.query.image, detail: req.query.detail, price: req.query.price, unit: req.query.unit};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addItemDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/food/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name,
					image: req.query.image, detail: req.query.detail, price: req.query.price, 
					unit: req.query.unit, langid: req.query.langid, index: req.query.index, invisible: req.query.invisible};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editItemDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/food/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteItemDining(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

/**
 * 
 * Boat schedule
 */
router.get('/boatschedule', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			client.getSpeedBoatSchedule({}, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message})); 
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/boatschedule/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {name: req.query.name, times: req.query.times};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addSpeedBoat(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/boatschedule/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, name: req.query.name, invisible: req.query.invisible};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSpeedBoat(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/boatschedule/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteSpeedBoat(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});


router.get('/schedule/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.query.id, time: req.query.time};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addBoatTime(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/schedule/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err); 
		}
		else {
			var parameter = {id: req.query.id, time: req.query.time};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editBoatTime(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/schedule/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteBoatTime(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
/**
 * Survey
 */
 
router.get('/survey/votenew', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			// check input
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getVoteSurveyNew(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.status, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
}); 
 
router.get('/survey/vote', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			// check input
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location,
					lang_id: req.query.lang_id
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getVoteSurvey(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
			
		}
	});
});
router.get('/survey', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.getSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/survey/add', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {name: req.query.name, image: req.query.image, status: req.query.status, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.addSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/survey/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id, name: req.query.name, image: req.query.image, status: req.query.status, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/survey_smile/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id, name: req.query.name, image: req.query.image, langid: req.query.langid, type: "2"};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSmile(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/survey/delete/:id', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.params.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});




router.get('/room', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			try{
				client.getRoom({}, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} catch(err){
				res.send(JSON.stringify({status: '-1', message: 'ERROR from FUNCTION'}));
			}
		}
	});
});

router.get('/language', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			client.getLanguage({}, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

router.get('/tablet/survey', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {arg0: JSON.stringify({lang_id: req.query.langid})};
			client.getSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.post('/tablet/postSurvey', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var room = req.body.room;
			var guest = req.body.guest;
			var survey = JSON.parse(req.body.survey);
			var args = {arg0: JSON.stringify({key: key, folionum: room, nameguest: guest, survey: survey})};
			common.log(args);
			client.postSurvey(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});


// api for tablet
router.post('/tablet/login', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var ip = req.body.ip;
			var args = {arg0: JSON.stringify({key: key, ip: ip})};
			client.register(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.post('/tablet/register', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var name = req.body.name;
			var ip = req.body.ip;
			var args = {arg0: JSON.stringify({key: key, ip: '172.16.9.119', name: name})};
			common.log(args);
			client.register(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.post('/tablet/smile', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var id = req.body.id;
			var args = {arg0: JSON.stringify({key: key, id: id})};
			common.log(args);
			client.setSmile(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});
router.post('/tablet/rating', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var id = req.body.id;
			var rating = req.body.rating;//req.body['rating[]'];
			var args = {arg0: JSON.stringify({"id": id, "rating": rating, "key": key})};
			common.log(args);
			client.setRating(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});
router.post('/tablet/rating/guest', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var id = req.body.id;
			var rating = req.body.rating;//req.body['rating[]'];
			var args = {arg0: JSON.stringify({"id": id, "rating": rating, "key": key, 
				folionum: req.body.folionum, nameguest: req.body.nameguest, checkindate: req.body.checkindate, checkoutdate: req.body.checkoutdate})};
			common.log(args);
			client.setRatingGuest(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});
router.post('/tablet/comment/guest', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var id = req.body.id;
			var text = req.body.text;
			var args = {arg0: JSON.stringify({text_comment: text, id: id,key: key,
				folionum: req.body.folionum, nameguest: req.body.nameguest, checkindate: req.body.checkindate, checkoutdate: req.body.checkoutdate})};
			common.log(args);
			client.setCommentGuest(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});

router.get('/comment', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			if(req.query.location != "" &&  req.query.date_from != "" 
				&& req.query.date_to != ""){
				common.log(JSON.stringify(req.query));
				var json = {
					date_from: req.query.date_from, 
					date_to: req.query.date_to, 
					location: req.query.location
				}
				var args = {"arg0": JSON.stringify(json)};
				client.getComment(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.status, statusMessage: err.response.statusMessage, message: err.message}));
					}
					else {
						common.log(result);
						res.send(result.return);
					}
				})
			} else {
				res.send(JSON.stringify({status: 0, message: 'Data input null or undefined. Please double-check.'}));
			}
		}
	});
});

router.post('/tablet/commentnew', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var room = req.body.room;
			var comment = req.body.comment;
			var guest = req.body.guest;
			var args = {arg0: JSON.stringify({text_comment: comment, folionum: room, key: key, nameguest: guest})};
			common.log(args);
			client.setCommentNew(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.status, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});

router.post('/tablet/comment', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var key = req.body.key;
			var id = req.body.id;
			var text = req.body.text;
			var args = {arg0: JSON.stringify({text_comment: text, id: id,key: key})};
			common.log(args);
			client.setComment(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
			
		}
	});
});
router.get('/tablet/location', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var args = {};
			client.getLocation(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			});
		}
	});
});
router.get('/tablet/info', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			try{
				var key = req.query.key;
				var langid = req.query.langid;
				var type = req.query.type;
				var args = {arg0: JSON.stringify({key: key, langid: langid, type: type})};
				common.log(args);
				client.getInfo(args, function(err, result) {
					if (err){
						res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
					} else {
						common.log(result);
						res.send(result.return);
					}
				});
			} catch(err){
				res.send({status: '1', message: 'ERROR from FUNCTION'});
			}
			
		}
	});
});
router.get('/tablet/smile/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id, name: req.query.name, image: req.query.image, langid: req.query.langid, type: "1"};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editSmile(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});
router.get('/tablet/rating/edit', function(req, res){
	soap.createClient(wsdl, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id, name: req.query.name, image: req.query.image, langid: req.query.langid};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.editRating(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
});

/**
 * Mobile
 */
router.get('/mobile/notify', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {};
			common.log(parameter);
			var args = {};
			client.checkNotifyRating(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
})
router.post('/mobile/notify/confirm', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter = {id: req.body.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.confirmRating(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
})
router.get('/mobile/notify/all', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {};
			common.log(parameter);
			var args = {};
			client.getNotify(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message}));
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
})
router.get('/mobile/notify/delete', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteNotify(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message})); 
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
})
router.get('/mobile/notify/delete/all', function(req, res){
	soap.createClient(wsdl_tablet, function(err, client) {
		if (err) {
			console.error(err);
		}
		else {
			var parameter =  {id: req.query.id};
			common.log(parameter);
			var args = {arg0: JSON.stringify(parameter)};
			client.deleteNotify(args, function(err, result) {
				if (err){
					res.send(JSON.stringify({status: err.response.statusCode, statusMessage: err.response.statusMessage, message: err.message})); 
				}
				else {
					common.log(result);
					res.send(result.return);
				}
			})
			
		}
	});
})
module.exports = router;
