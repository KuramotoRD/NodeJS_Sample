/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Node.js is listening to PORT:" + server.address().port);
});

// View EngineにEJSを指定。
app.set('view engine', 'ejs');

// Routes
var photoList = require('./routes/photoList');
var photoPut = require('./routes/photoPut');
var photoGet = require('./routes/photoGet');

app.use("/api/photo/list", photoList);
app.use("/api/photo/put", photoPut);
app.use("/api/photo/get", photoGet);

// "/"へのGETリクエストでindex.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
	res.render("index", {});
});

// Cloudant DB
var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');
