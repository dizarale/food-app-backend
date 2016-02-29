"use strict";
var express = require('express');
var app = express();
var bodyParser    = require('body-parser');
var cookie  = require('cookie-parser');
var mongo   = require('mongodb').MongoClient;
var storage = 'mongodb://localhost:27017/food-app';

var page = ['index','user','resturant','menu'];


app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.use(cookie());
app.use(express.static('public'));

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
app.get ('/resturant',  (req, res) => {
	let user_email = req.params.email
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
				database.collection('resturant').insert({
					res_name:    req.body.res_name,
					res_location:{ lat : req.body.lat , lng : req.body.lng}
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
				database.collection('resturant').update({res_name:req.body.res_name},{
					res_name:    req.body.res_name,
					res_location:{ lat : req.body.lat , lng : req.body.lng}
				});
				let result = { "status" :  1 , "detail" : "Update success" };
				res.json(result);
			}else if(result.length == 0){
				let result = { "status" : -1 , "detail" : "Not Found Resturant" };
				res.json(result);
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
							pic: 	  req.body.pic
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
							pic: 	  req.body.pic
						});
						let result = { "status" :  1 , "detail" : "Update Menu Success" };
						res.json(result);
					}
				});
			}
		});
	});
});
app.use(ErrorHandler);
app.listen(80);

function ErrorHandler( req, res) {
	var check =0;
	var result="";
	for (var v of page){
		var test = longestSubstring(req.url,v);
		if(test == check){
			result+=" or "+v;
			check=test;
		}
		if(test > check){
			result=v;
			check=test;
		}
	}
	res.status(404).send('error 404 Page not found!!'+'  Are You Mean '+result);
}
function longestSubstring(s,t){
	var reS = t;
	var ans = "";
	var textcheck ="";
	var count=0;
	var anscount=0;
	var con=false;
	if(s==reS) return s;
	var i=0;
	var j=0;
	var n = s.length-1;
    	while(i<=s.length-1&&j<=s.length-1){
    		if(reS[j]==s[i]&&con){
    			count++;
    			textcheck+=s[i];
    			j++;
    			i++;
    		}else if(reS[j]==s[i]){
	    		count = 1;
	    		textcheck = reS[j];
	    		j++;
	    		con = true;
	    		i++;
	    		
	    	}else if(con){
	    		con =false;
	    		i=0;
	    		//console.log(anscount+":"+ans+":"+count);
	    	}else{
	    		i++;
	    	}
	    }
	    if(anscount<count){
	    			anscount = count;
	    			ans = textcheck;
	    }
	var percen = ans.length/s.length;
    return percen;
}
