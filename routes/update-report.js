module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.post("/update-report/:id", function (req, res) {

		// update is set to the content sent to the post url
		var update = req.body;

		// the target for us to update is the id passed through the url
		var target = req.params.id;


		// search the database for the record that matches our target id,
		// update that record, then save
		req.models.texas_jobs.find({id: target}, function(err, report) {
	            report[0].key = update.key;
	            report[0].save();
	            console.log(report[0]);
	        });
	    res.send("update complete");

	});

};
