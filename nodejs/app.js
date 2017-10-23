/* 1. express���W���[�������[�h���A�C���X�^���X������app�ɑ���B*/
var express = require("express");
var app = express();

/* 2. listen()���\�b�h�����s����3000�ԃ|�[�g�ő҂��󂯁B*/
var server = app.listen(process.env.PORT || 3000, function(){
	console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. �Ȍ�A�A�v���P�[�V�����ŗL�̏��� */

// �ʐ^�̃T���v���f�[�^
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

// �ʐ^���X�g���擾����API
app.get("/api/photo/list", function(req, res, next){
	res.json(photoList);
});

// �ʐ^���X�g���擾����API (photoID�w��)
app.get("/api/photo/:photoId", function(req, res, next){
	var photo;
	for (i = 0; i < photoList.length; i++){
		if (photoList[i].pid == req.params.photoId){
			var photo = photoList[i];
		}
	}
	res.json(photo);
});

// �ʐ^��ǉ�����API
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

// �ʐ^���擾����API
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
				// �h�L�������g���ꌏ���Ȃ��Ƃ��̏���
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

// View Engine��EJS���w��B
app.set('view engine', 'ejs');

// "/"�ւ�GET���N�G�X�g��index.ejs��\������B�g���q�i.ejs�j�͏ȗ�����Ă��邱�Ƃɒ��ӁB
app.get("/", function(req, res, next){
	res.render("index", {});
});

// Cloudant DB
var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');
