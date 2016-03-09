"use strict";
var express = require('express');
var app = express();
var bodyParser    = require('body-parser');
var cookie  = require('cookie-parser');
var mongo   = require('mongodb').MongoClient;
var storage = 'mongodb://localhost:27017/food-app';

var page = ['index','user','resturant','menu','preorder'];


app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.use(cookie());
app.use(express.static('public'));


app.get ('/user',  (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('users')
		.find().
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found User"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found User", "row" : result.length, "data":result}
				res.json(data);
			}
		});
	});
});
app.get ('/user/:email',  (req, res) => {
	let user_email = req.params.email
	mongo.connect(storage, (error, database) => {
		database
		.collection('users')
		.find({email:user_email}).
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found User"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found User", "data":result}
				res.json(data);
			}
		});
	});
});
app.post('/user', (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('users')
		.find({email:req.body.email})
		.toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 0) {
				database.collection('users').insert({
					email:    req.body.email,
					token:    req.body.token,
					pic: 	  req.body.pic,
					public_profile : req.body.public_profile
				});
				let result = { "status" :  1 , "detail" : "insert success" };
				res.json(result);
			}else if(result.length == 1){
				let result = { "status" : -1 , "detail" : "Duppicate User" };
				res.json(result);
			}
		});
	});
});
app.get ('/resturant',  (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find().
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found Resturant", "row" : result.length, "data":result}
				res.json(data);
			}
		});
	});
});
app.get ('/resturant/rout',  (req, res) => {
	let res_id = require('mongodb').ObjectID("56e05344f4e190cb06f67b28");
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id }).
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found Resturant", "row" : result.length, "data":result}
				res.json(data);
			}
		});
	});
});
app.get ('/resturant/:res_id',  (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id }).
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found Resturant", "data":result}
				res.json(data);
			}
		});
	});
});

app.post('/resturant', (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({res_name:req.body.res_name})
		.toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 0) {
				var location = []
				location.push({row:0,data:[]});
				database.collection('resturant').insert({
					res_name:    req.body.res_name,
					res_img:     req.body.res_img,
					res_detail:  req.body.res_detail,
					res_manager: req.body.res_manager,
					res_tel:     req.body.res_tel,
					res_email:   req.body.res_email,
					res_open:    req.body.res_open,
					res_close:    req.body.res_close,
					res_status:    req.body.res_status,
					res_location: location
				});
				let result = { "status" :  1 , "detail" : "insert success" };
				res.json(result);
			}else if(result.length == 1){
				let result = { "status" : -1 , "detail" : "Duppicate Resturant" };
				res.json(result);
			}
		});
	});
});
app.put('/resturant', (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({res_name:req.body.res_name})
		.toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 1) {
				var location = []
				location.push({row:0,data:[]});
				database.collection('resturant').update({res_name:req.body.res_name},{ $set:{
					res_name:    req.body.res_name,
					res_img:     req.body.res_img,
					res_detail:  req.body.res_detail,
					res_manager: req.body.res_manager,
					res_tel:     req.body.res_tel,
					res_email:   req.body.res_email,
					res_open:    req.body.res_open,
					res_close:    req.body.res_close,
					res_status:    req.body.res_status,
					res_location: location
				}},
				{ upsert: true }
				);
				let result = { "status" :  1 , "detail" : "Update success" };
				res.json(result);
			}else if(result.length == 0){
				let result = { "status" : -1 , "detail" : "Not Found Resturant" };
				res.json(result);
			}
		});
	});
});
app.post('/resturant/addarea/:res_id', (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id }).
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				var location = {};
				var location_data = [];
				var num = result[0]['res_location']['row'];
				
				if(num>0){
					for(var i = 0 ; i< num ; i++){
						location_data.push(result[0]['res_location']['data'][i]);
					}
				}
				console.log("location_data :"+ JSON.stringify(location_data));
				let location_name = req.body.location_name;
				let LTlat = req.body.LTlat;
				let RTlat = req.body.RTlat;
				let LTlng = req.body.LTlnt;
				let RTlng = req.body.RTlng;
				let LBlat = req.body.LBlat;
				let RBlat = req.body.RBlat;
				let LBlng = req.body.LBlng;
				let RBlng = req.body.RBlng;
				let location_cost = req.body.cost;
				var location_point = {LTLat:LTlat,RTLat:RTlat,LTLng:LTlng,RTLng:RTlng,LBLat:LBlat,RBLat:RBlat,LBLng:LBlng,RBLng:RBlng};
				var location_area = {}
				if(num>0){
					num++;
					location_area = {area :num ,name : location_name,cost : location_cost,location_latlng:location_point};
				}else{
					num = 1;
					location_area = {area :num ,name : location_name,cost : location_cost,location_latlng:location_point};
				}
				console.log("location_point :"+ JSON.stringify(location_point));
				console.log("location_area :"+ JSON.stringify(location_area));

				location_data.push(location_area);
				console.log("location_data :"+ JSON.stringify(location_data));

				location = {row:num,data:location_data};
				console.log("location :"+ JSON.stringify(location));
				database.collection('resturant').update({ "_id" : res_id },{ $set:{
					res_location: location
				}}
				);
				let data = { "status":1, "detail" : "Update Location Success"};
				res.json(data);
			}
		});
});
});
app.post('/resturant/editarea/:res_id', (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id }).
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				
				let data = { "status":1, "detail" : "Update Location Success"};
				res.json(data);
			}
		});
	});
});
app.get ('/menu/:res_id',  (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id }).
		toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Resturant"};
				res.json(result);
			}else{
				database.collection('menu').find({ "res_id" : res_id }).toArray((error,result) =>{
					if(result.length == 0){
						let result = { "status" : -1, "detail" : "Not Have Menu in Resturant"};
						res.json(result);
					}else{
						let data = { "status":1, "detail" : "Found Menu", "row":result.length, "data":result};
						res.json(data);
					}
				});
			}
		});
	});
});
app.post('/menu/:res_id', (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id })
		.toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 0) {
				let result = { "status" :  -1 , "detail" : "Not Found Resturant" };
				res.json(result);
			}else if(result.length == 1){
				database.collection('menu').find({"res_id" : res_id, "name":req.body.name}).toArray((error,result)=>{
					if(result.length==0){
						database.collection('menu').insert({
							res_id:   res_id,
							name:     req.body.name,
							price:    req.body.price,
							pic: 	  req.body.pic,
							type: 	  req.body.type
						});
						let result = { "status" :  1 , "detail" : "insert success" };
						res.json(result);
					}else{
						let result = { "status" :  -1 , "detail" : "Duppicate Menu" };
						res.json(result);
					}
				});
			}
		});
	});
});
app.put('/menu/:res_id', (req, res) => {
	let res_id = require('mongodb').ObjectID(req.params.res_id);
	mongo.connect(storage, (error, database) => {
		database
		.collection('resturant')
		.find({ "_id" : res_id })
		.toArray((error, result) => {
			if(error){
				let result = { "status" : 0 , "detail" : "Database Error" };
				res.json(result);
			}else if (result.length == 0) {
				let result = { "status" :  -1 , "detail" : "Not Found Resturant" };
				res.json(result);
			}else if(result.length == 1){
				database.collection('menu').find({"res_id" : res_id, "name":req.body.name}).toArray((error,result)=>{
					if(result.length==0){
						let result = { "status" :  -1 , "detail" : "Not Found Menu" };
						res.json(result);
					}else{
						database.collection('menu').update({"res_id" : res_id, "name":req.body.name},{
							res_id:   res_id,
							name:     req.body.name,
							price:    req.body.price,
							pic: 	  req.body.pic,
							type: 	  req.body.type
						});
						let result = { "status" :  1 , "detail" : "Update Menu Success" };
						res.json(result);
					}
				});
			}
		});
	});
});
app.get ('/order/preorder/',  (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('orders')
		.find().
		toArray((error, result) => {
			if (result.length == 0) {
				let result = { "status" : -1, "detail" : "Not Found Order"};
				res.json(result);
			}else{
				let data = { "status":1, "detail" : "Found Order", "row" : result.length, "data":result}
				res.json(data);
			}
		});
	});
});
app.post('/order/preorder/menu', (req, res) => {
	var user = req.body.email;
	let res_id =  req.body.res_id;
	let Menu_id = req.body.menu_id;
	let Menu_num = req.body.menu_num;
	let Menu_des = req.body.menu_des;
	let menu = {menu_id : Menu_id , menu_num:Menu_num , menu_des : Menu_des};
	let order_lat = req.body.order_lat;
	let order_lng = req.body.order_lng;
	let order_detail = req.body.order_detail;
	var data;
	if(Menu_num>0 && Menu_num<100){
		mongo.connect(storage, (error, database) => {
			database
			.collection('users')
			.find({email:user})
			.toArray((error, result) => {
				if(error){
					let result = { "status" : 0 , "detail" : "Database Error" };
					res.json(result);
				}else if (result.length == 0) {
					let result = { "status" :  -1 , "detail" : "Not Have User" };
					res.json(result);
				}else if(result.length == 1){
					database.collection('orders').find({email:user,order_status:0}).toArray((error,result) =>{
						if(error){
							let result = { "status" : 0 , "detail" : "Database Error" };
							res.json(result);
						}else if(result.length == 0){
							var order = [];
							order.push(menu);
							var order_menu = { row:1 , menu : order};
							database.collection('orders').insert({
								email:    user,
								restaurant: res_id,
								order_status : 0,
								order_location : { order_lat : order_lat , order_lng : order_lng },
								order_detail : order_detail,
								order_menu : order_menu
							});
							let result = { "status" : 0 , "detail" : "Insert Pre-Order" };
							res.json(result);
						}else if(result.length == 1){
							if(res_id == result[0]['res_id']){
								var order = [];
								let num = result[0]['order_menu']['row'];
								var check = false;
								for (var i = 0; i < num; i++) {
									if(Menu_id == result[0]['order_menu']['menu'][i]['menu_id'] && Menu_des == result[0]['order_menu']['menu'][i]['menu_des']){
										console.log("have");
										result[0]['order_menu']['menu'][i]['menu_num'] = parseInt(result[0]['order_menu']['menu'][i]['menu_num']) +  parseInt(Menu_num);
										order.push(result[0]['order_menu']['menu'][i]);
										check = true;
									}else{
										order.push(result[0]['order_menu']['menu'][i]);
									}
								};
								if(check){
									var order_menu = { row:num , menu : order};
									data = { "status" : 1 , "detail" : "Update Menu in Pre-Order" };
								}else{
									num++;
									var order_menu = { row:num , menu : order};
									order.push(menu);
									data = { "status" : 1 , "detail" : "Update Insert Menu in Pre-Order" };
								}
								database.collection('orders').update({ email:user },{ $set:{
									order_menu : order_menu
								}});
								
							}else{
								data = { "status" : -1 , "detail" : "Have Menu in other restaurant" };
							}
							res.json(data);
						}
					});
				}
			});
		});
	}else{
		var data;
		data = { "status" : -1 , "detail" : "menu is 0 or Over [Who are You]" };
	}
});
app.use(ErrorHandler);
app.listen(1200);

function ErrorHandler( req, res) {
	res.status(404).send('error 404 Page not found!!');
}

