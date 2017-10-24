var express = require("express");
var router = express.Router();

var Cloudant = require('cloudant');
var cloudant = Cloudant({instanceName: "Cloudant NoSQL DB-BeaconDataPool2", vcapServices: JSON.parse(process.env.VCAP_SERVICES)});
var db = cloudant.db.use('beacondb');

// é ê^ÇéÊìæÇ∑ÇÈAPI
router.get("/:photoId", function(req, res, next){
	var query = {
		"selector": {
			"pid" : req.params.photoId
		}
	};

	db.find(query, function(err, data) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}

		if (data.docs.length === 0) {
			console.log("No Data.");
			return;
		}

		console.log("Selected: %d", data.docs.length);

		var resultData = [];

		for (var i = 0; i < data.docs.length; i++) {
			resultData.push(data.docs[i]);
		}

		res.json(resultData);
	});
});

router.get("/gt/:photoId", function(req, res, next){
	var query = {
		"selector": {
			"pid" : {
				"$gt" : req.params.photoId
			}
		},
		"sort": [
			{
				"pid:string": "asc"
			}
		]
	};

	db.find(query, function(err, data) {
		if (err) {
			console.log("DB Access Error!!!");
			res.json(err);

			return;
		}

		console.log("Selected: %d", data.docs.length);

		res.json(data.docs);
	});
});

module.exports = router;
