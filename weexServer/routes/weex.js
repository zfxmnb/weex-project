var express = require('express');
var router = express.Router();
var mongo=require("mongodb");

//var port=mongo.Connection.DEFAULT_PORT;
var host="localhost";
var server=new mongo.Server(host,27017,{auto_reconnect:true});//创建数据库所在的服务器服务器
var db=new mongo.Db("weex",server,{safe:true});//创建数据库对象
/* GET home page. */
router.post('/', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Content-Type","text/plain;utf-8");
  //if(req.body.type=="login"||req.body.type=="register"||req.body.type=="user"||req.body.type=="resetnick"||req.body.type=="resetimg"||req.body.type=="search"){
  	var collection="user";
  //}else{
  	//var collection="record";
  //}
  db.open(function (err,db) {
	    db.collection(collection,function(err,collection){
	    	if(err) throw err;
	        else{
			  //console.log(req.body)
			  //登录
			  if(req.body.type=="login"){
			  	collection.findOne({username:req.body.username,password:req.body.password},function (err,docs){
		 			if(err) throw err;
		 			else{
		 				if(!docs){
		 						res.end(JSON.stringify({success:"false"}));
		 				}else{
		 						res.end(JSON.stringify({success:"true",username:req.body.username}));
		 				}	
		 				db.close();	
		 			}
		 		})
			  }
			  //注册
			  else if(req.body.type=="register"){
			  	collection.findOne({username:req.body.username},function (err,docs){
		 			if(err) throw err;
		 			else{
		 				if(!docs){
		 					collection.insert({
		 						username:req.body.username,
		 						password:req.body.password,
		 						headimg:req.body.headimg,
		 						nickname:req.body.nickname
		 					},
	 						function (err,docs){
	 							if(err) throw err;
								else{
									res.end(JSON.stringify({success:"true"}));
									db.close();
								}
		 					});	
		 				}else{
		 						res.end(JSON.stringify({success:"false"}));
		 						db.close();
		 				}		
		 			}
		 		})
			  }
			  //获取用户信息
			  else if(req.body.type=="user"){
			  	collection.findOne({username:req.body.username},function (err,docs){
		 			if(err) throw err;
		 			else{
		 				console.log(docs);
		 				if(!docs){
		 						res.end(JSON.stringify({success:"false"}));
		 				}else{

		 						res.end(JSON.stringify({success:"true",username:req.body.username,nickname:docs.nickname,headimg:docs.headimg}));
		 				}	
		 				db.close();	
		 			}
		 		})
			  }
			  //修改昵称
			  else if(req.body.type=="resetnick"){
			  	collection.updateOne(
			  		{username:req.body.username},
			  		{$set:{nickname:req.body.nickname}},
			  		function (err,docs){
		 			if(err) throw err;
		 			else{
		 				res.end(JSON.stringify({success:true}));
		 				db.close();	
		 			}
		 		})
			  }
			  //修改头像
			  else if(req.body.type=="resetimg"){
			  	collection.updateOne(
			  		{username:req.body.username},
			  		{$set:{headimg:req.body.headimg}},
			  		function (err,docs){
		 			if(err) throw err;
		 			else{
		 				res.end(JSON.stringify({success:"true"}));
		 				db.close();	
		 			}
		 		})
			  }
			  //搜索用户
			  else if(req.body.type=="search"){
			  	collection.find({
			  			$or:[{username:{$regex: req.body.searchword, $options:'i'}},{nickname:{$regex: req.body.searchword, $options:'i'}}]
			  		}).toArray(function (err,docs){
			 			if(err) throw err;
			 			else{
			 				//console.log(docs);
			 				if(!docs){
			 					res.end(JSON.stringify({success:"false"}));
			 				}else{
			 					res.end(JSON.stringify({success:"true",data:docs}));
			 				}	
			 				db.close();	
			 			}
		 		})
			  }
			  //添加好友
			  else if(req.body.type=="addfriend"){
			  		console.log(req.body);
			  		var date=new Date();
			  		var time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			  		msg(req.body.username,req.body.tousername,"等待对方确认",time,"from",function(){
			  			msg(req.body.tousername,req.body.username,"账号为"+req.body.username+"的用户申请加您为好友",time,"to",function(){
			  				res.end(JSON.stringify({success:"true"}));
			  				db.close();	
			  			});
			  		})
			  }
			  //获取消息
			  else if(req.body.type=="loadmsg"){
			  		collection.findOne({username:req.body.username},function (err,docs){
		 			if(err) throw err;
		 			else{
		 				if(!docs){
		 					res.end(JSON.stringify({success:"false"}));
		 				}else{
		 					console.log(docs)
		 					res.end(JSON.stringify({success:"true",msg:docs.msg}));
		 				}
		 				db.close();	
		 			}
		 		})
			  }
			  //批量获取用户信息
			  else if(req.body.type=="batchuser"){
			  		console.log(req.body.condition);
			  		if(req.body.condition.length>0)
				  		collection.find({
				  			$or:JSON.parse(req.body.condition)
				  		}).toArray(function (err,docs){
				 			if(err) throw err;
				 			else{
				 				if(!docs.length>0){
				 					res.end(JSON.stringify({success:"false"}));
				 				}else{
				 					res.end(JSON.stringify({success:"true",data:docs}));
				 				}	
				 				db.close();	
				 			}
			 			})
			 		else{
			 			res.end(JSON.stringify({success:"false"}));
			 			db.close();	
			 		}

			  }

			  function msg(username1,username2,message,time,type,callback){
			  	collection.findOne({
			  			username:username1
			  		},function (err,docs){
			 			if(err) throw err;
			 			else{
			 				if(!docs){
			 					res.end(JSON.stringify({success:"false"}));
			 					db.close();
			 				}else{
			 					if(docs.msg){
			 						var msg=","+docs.msg;
			 					}else{
			 						var msg="";
			 					}
			 					var m=JSON.stringify({'username':username2,'msg':message,'time':time,'type':type});
			 					m+=msg;
			 					collection.updateOne(
							  		{username:username1},
							  		{$set:{msg:m}},
							  		function (err,docs){
						 			if(err) throw err;
						 			else{
						 				//res.end(JSON.stringify({success:"true"}));
						 				callback.call();
						 			}
						 		})
			 					//res.end(JSON.stringify({success:"true",data:docs}));
			 				}		
			 			}
		 			})
			  }

			}
		});
	});
});

module.exports = router;
