module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.get("/", function (req, res) {   

		//////////////////////////////////////////////
		////// DATABASE REQUEST //////////////////////
		//////////////////////////////////////////////

		// find all the records in the database ( {} returns all records), sort by date
		// then pass the resulting records as "reports" to a function. "reports" is an array
		req.models.texas_jobs.find({}, "date").run(function(err, reports){

			//set meta.targetPeriod = to the last 13 records in the returned "reports" array
			meta.targetPeriod = reports.slice(-13);

			// set meta.latestReport to the most recent record in the reports array
			meta.latestReport = meta.targetPeriod[meta.targetPeriod.length - 1]

			res.render("index.html", meta);

		});

	});

}