module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.get("/find-reports/:month/:year", function (req, res) {
		console.log("finding report");


		//////////////////////////////////////////////
		////// DATABASE REQUEST //////////////////////
		//////////////////////////////////////////////

		var targetMonth = req.params.month;
		var targetYear = req.params.year;
		// find all the records in the database ( {} returns all records), sort by date
		// then pass the resulting records as "reports" to a function. "reports" is an array
		req.models.texas_jobs.find({month: targetMonth, year: targetYear}).run(function(err, targetReport){

			// sets meta.lastPeriod = to the most recent report in the database
			meta.targetReport = targetReport;
            res.json(meta);
		});

	});

};
