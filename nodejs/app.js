/* 1. express���W���[�������[�h���A�C���X�^���X������app�ɑ���B*/
var express = require("express");
var app = express();

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* 2. listen()���\�b�h�����s����3000�ԃ|�[�g�ő҂��󂯁B*/
var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Node.js is listening to PORT:" + server.address().port);
});

// View Engine��EJS���w��B
app.set('view engine', 'ejs');

// Routes
var photoList = require('./routes/photoList');
var photoPut = require('./routes/photoPut');
var photoGet = require('./routes/photoGet');

app.use("/api/photo/list", photoList);
app.use("/api/photo/put", photoPut);
app.use("/api/photo/get", photoGet);

// "/"�ւ�GET���N�G�X�g��index.ejs��\������B�g���q�i.ejs�j�͏ȗ�����Ă��邱�Ƃɒ��ӁB
app.get("/", function(req, res, next){
	res.render("index", {});
});

// Cloudant DB
var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');
