var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongojs=require('mongojs');
var db=mongojs('saveMe',['logs']);
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));

app.post('/reqPost',function(req,res){
	console.log("post request ");
	console.log(req.body.requestDetails.username);
	var address=req.body.requestDetails.address;
	db.logs.insert({username:req.body.requestDetails.username,requestType:req.body.requestDetails.requestType,address:{latitude:address.latitude,longitude:address.longitude,city:address.city,region:address.regionName},statusOfReq:'pending'},function(err,docs){
           console.log(docs);
                res.json(docs);
        });
});
app.post('/reqUpdateApprove',function(req,res){
	console.log(req.body.Object_id);
	db.logs.findAndModify({Querry : {_id:mongojs.ObjectId(req.params.id)},
	update :  {$set : {statusOfReq:'approved'}},
	new:true},function(err,docs){
		res.json(docs);
	});
});
app.post('/reqUpdateReject',function(req,res){
	console.log(req.body.Object_id);
	db.logs.findAndModify({Querry : {_id:mongojs.ObjectId(req.params.id)},
	update :  {$set : {statusOfReq:'rejected'}},
	new:true},function(err,docs){
		res.json(docs);
	});
});
app.post('/reqForReview',function(req,res){
	console.log(req.body.requestType);
	db.logs.find({requestType:req.body.requestType},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
});
app.post('/userReqTillNow',function(req,res){
	console.log(req.body.username);
	db.logs.find({username:req.body.username},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
});

app.listen('3000');
console.log('i m listening to port 3000');