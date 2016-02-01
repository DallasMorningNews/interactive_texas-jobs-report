module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.get("/reports/:year/:month", function (req, res) {   

		//////////////////////////////////////////////
		////// DATABASE REQUEST //////////////////////
		//////////////////////////////////////////////

		// find all the records in the database ( {} returns all records), sort by date
		// then pass the resulting records as "reports" to a function. "reports" is an array
		req.models.texas_jobs.find({}, "date").run(function(err, reports){

			// sets meta.lastPeriod = to the most recent report in the database
			meta.lastReport = reports[reports.length-1]; 

			meta.targetPeriod;

			for (i=0; i<reports.length; i++) {
				console.log(reports[i].month, reports[i].year, req.params.month, req.params.year);
				if (reports[i].month == req.params.month && reports[i].year == req.params.year) {
					console.log(i);
					var j = i - 12;
					meta.targetPeriod = reports.slice(j, i + 1);
					// set meta.latestReport to the most recent record in the reports array
					meta.latestReport = meta.targetPeriod[meta.targetPeriod.length - 1]
				}
			}



			res.render("index.html", meta);

		});

	});

}