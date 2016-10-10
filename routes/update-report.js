module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.post("/update-report/:month/:year", function (req, res) {

		// update is set to the content sent to the post url
		var update = req.body;

		// the target for us to update is the month and year passed through the url
		var targetMonth = req.params.month;
		var targetYear = req.params.year;


		// search the database for the record that matches our target id,
		// update that record, then save
		req.models.texas_jobs.find({month: targetMonth, year: targetYear}, function(err, report) {
	            // report[0].key = update.key;
				report[0].date = update.date;
	            report[0].month = update.month;
	            report[0].year = update.year;
	            report[0].publish_date = update.publish_date;
	            report[0].image = update.image;
	            report[0].image_credit = update.image_credit;
	            report[0].image_cutline = update.image_cutline;
	            report[0].main_headline = update.main_headline;
	            report[0].main_deck = update.main_deck;
	            report[0].byline = update.byline;
	            report[0].title = update.position;
	            report[0].email = update.author_email;
	            report[0].twitter = update.author_twitter;
	            report[0].intro = update.intro;
	            report[0].blurb1_head = update.blurb1_head;
	            report[0].blurb1 = update.blurb1;
	            report[0].blurb2_head = update.blurb2_head;
	            report[0].blurb2 = update.blurb2;
	            report[0].blurb3_head = update.blurb3_head;
	            report[0].blurb3 = update.blurb3;
	            report[0].blurb4_head = update.blurb4_head;
	            report[0].blurb4 = update.blurb4;
	            report[0].texas_jobless_rate = update.texas_jobless_rate;
	            report[0].dfw_jobless_rate = update.dfw_jobless_rate;
	            report[0].jobless_head = update.jobless_head;
	            report[0].jobless_chatter = update.jobless_chatter;
	            report[0].industry_chatter = update.industry_chatter;
	            report[0].state_employment = update.state_employment;
	            report[0].state_explainer = update.state_explainer;
	            report[0].chart_source  = update.chart_source;
	            report[0].cat1  = update.cat1;
	            report[0].cat1_amount  = update.cat1_amount;
	            report[0].cat2  = update.cat2;
	            report[0].cat2_amount  = update.cat2_amount;
	            report[0].cat3  = update.cat3;
	            report[0].cat3_amount  = update.cat3_amount;
	            report[0].cat4  = update.cat4;
	            report[0].cat4_amount  = update.cat4_amount;
	            report[0].cat5  = update.cat5;
	            report[0].cat5_amount  = update.cat5_amount;
	            report[0].cat6  = update.cat6;
	            report[0].cat6_amount  = update.cat6_amount;
	            report[0].cat7  = update.cat7;
	            report[0].cat7_amount  = update.cat7_amount;
	            report[0].cat8 = update.cat8;
	            report[0].cat8_amount = update.cat8_amount;
	            report[0].cat9 = update.cat9;
	            report[0].cat9_amount = update.cat9_amount;
	            report[0].cat10 = update.cat10;
	            report[0].cat10_amount  = update.cat10_amount;
	            report[0].cat11 = update.cat11;
	            report[0].cat11_amount = update.cat11_amount;

	            report[0].save();
	            console.log(report[0]);
	        });
	    res.send("update complete");

	});

};
