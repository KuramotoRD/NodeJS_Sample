/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. 以後、アプリケーション固有の処理 */

// 写真のサンプルデータ
var photoList = [
	{
		pid: "001",
		name: "photo001.jpg",
		type: "jpg",
		dataUrl: "http://localhost:3000/data/photo001.jpg"
	},{
		pid: "002",
		name: "photo002.jpg",
		type: "jpg",
		dataUrl: "http://localhost:3000/data/photo002.jpg"
	}
]

// 写真リストを取得するAPI
app.get("/api/photo/list", function(req, res, next){
	res.json(photoList);
});

// 写真リストを取得するAPI (photoID指定)
app.get("/api/photo/:photoId", function(req, res, next){
	var photo;
	for (i = 0; i < photoList.length; i++){
		if (photoList[i].pid == req.params.photoId){
			var photo = photoList[i];
		}
	}
	res.json(photo);
});

// 写真を追加するAPI
app.get("/api/photo/put/:photoId", function(req, res, next){
	var photoData = {
		pid: req.params.photoId,
		name: "photo" + req.params.photoId + ".jpg",
		type: "jpg",
		dataUrl: "http://localhost:3000/data/photo" + req.params.photoId + ".jpg"
	};

	db.insert(photoData, function (er, result) {
		if (er) {
			console.log("DB Access Error!!!");
		}
	});

	res.json(photoData);
});

// 写真を取得するAPI
app.get("/api/photo/get/:photoId", function(req, res, next){
	var selector = {
		q: "pid:" + req.params.photoId
	};

	var resultData = [];

	db.search('beacondbdoc', 'pid-text', selector, function(er, result) {
		if (er) {
			console.log("DB Access Error!!!");
			res.json(er);
		} else {
			console.log('Showing %d out of a total %d', result.rows.length, result.total_rows);

			if (result.rows.length === 0) {
				// ドキュメントが一件もないときの処理
			} else {
				for (var i = 0; i < result.rows.length; i++) {
					db.get(result.rows[i].id, function(er2, data) {
						if (er2) {
							console.log("DB Access Error2!!!");  
							res.json(er);
						} else {
							resultData.push(data);
						}
					});
				}
			} 
		}
	});

	res.json(resultData);
});

app.get("/api/photo/get2/:photoId", function(req, res, next){
	var selector = {
		q: "pid:301"
	};

	db.search('beacondbdoc', 'pid-text', selector, function(er, result) {
		if (er) {
			console.log("DB Access Erroe!!!");
			res.json(er);
		} else {
			res.json(result.rows);
		}
	});
});

// View EngineにEJSを指定。
app.set('view engine', 'ejs');

// "/"へのGETリクエストでindex.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
	res.render("index", {});
});

// Cloudant DB
var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');
