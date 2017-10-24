var express = require("express");
var router = express.Router();

var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');

// �ʐ^���X�g���擾����API
router.get("/all", function(req, res, next){
	db.view('beacondbdoc2', 'all-view', function(err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}

		console.log("Selected: %d", result.total_rows);

		res.json(result.rows);
	});
});

// JPEG�ʐ^���X�g���擾����API
router.get("/jpeg", function(req, res, next){
	db.view('beacondbdoc2', 'jpeg-view', function(err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}

		console.log("Selected: %d", result.total_rows);

		res.json(result.rows);
	});
});

// PNG�ʐ^���X�g���擾����API
router.get("/png", function(req, res, next){
	db.view('beacondbdoc2', 'png-view', function(err, result) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}

		console.log("Selected: %d", result.total_rows);

		res.json(result.rows);
	});
});

module.exports = router;
