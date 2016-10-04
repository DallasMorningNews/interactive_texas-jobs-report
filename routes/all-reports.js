module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.get("/all-reports", function (req, res) {
		console.log("all reports coming");
		//////////////////////////////////////////////
		////// DATABASE REQUEST //////////////////////
		//////////////////////////////////////////////

		// find all the records in the database ( {} returns all records), sort by date
		// then pass the resulting records as "reports" to a function. "reports" is an array
		req.models.texas_jobs.find({}).run(function(err, allReports){

			// sets meta.lastPeriod = to the most recent report in the database
			meta.reports = allReports;
            res.json(meta);
		});

	});

};
