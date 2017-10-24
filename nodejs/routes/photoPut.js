var express = require("express");
var router = express.Router();

var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');

var Validator = require('jsonschema').Validator;
var photoValidator = new Validator();

// JSON�X�L�[�}
const photoSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"type": "object",
	"required": ["pid", "name", "type", "dataUrl"],
	"properties": {
		"pid": {
			"description": "�ʐ^ID",
			"type": "string"
		},
		"name": {
			"description": "�t�@�C����",
			"type": "string"
		},
		"type": {
			"description": "�g���q",
			"type": "string"
		},
		"dataUrl": {
			"description": "�ڑ�URL",
			"type": "string"
		}
	}
};

// �ʐ^��ǉ�����API
router.get("/:photoId", function(req, res, next){
	var photoData = {
		pid: req.params.photoId,
		name: "photo" + req.params.photoId + ".jpg",
		type: "jpg",
		dataUrl: "http://localhost:3000/data/photo" + req.params.photoId + ".jpg"
	};

	db.insert(photoData, function (err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}
	});

	res.json(photoData);
});

// �ʐ^��ǉ�����API(JSON��)
router.post("/json", function(req, res, next){
	console.log(req.body);

	// JSON�o���f�[�V����
	var check = photoValidator.validate(req.body, photoSchema);
	if (check.errors.length > 0) {
		console.log(check.errors);

		var message = "";
		for (i = 0; i < check.errors.length; i++){
			if (i > 0) {
				message += ", ";
			}
			var error = check.errors[i];
			message += error.property + ":" + error.message;
		}

		res.json({
			resultFlag: false,
			message: message
		});

		return;
	}

	// �f�[�^�o�^
	db.insert(req.body, function (err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			console.log(err);

			res.json({
				resultFlag: false,
				message: "DB Access Error!!!"
			});

			return;
		}

		res.json({
			resultFlag: true,
			message: "sucess"
		});
	});
});

module.exports = router;
