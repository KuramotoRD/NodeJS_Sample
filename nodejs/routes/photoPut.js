var express = require("express");
var router = express.Router();

var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');

// é ê^Çí«â¡Ç∑ÇÈAPI
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
		}
	});

	res.json(photoData);
});

// é ê^Çí«â¡Ç∑ÇÈAPI(JSONî≈)
router.post("/json", function(req, res, next){
	console.log(req.body);

	db.insert(req.body, function (err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			console.log(err);

			res.json({
				resultFlag: false,
				message: "DB Access Error!!!"
			});
		}

		res.json({
			resultFlag: true,
			message: "sucess"
		});
	});
});

module.exports = router;
