module.exports = function(app){

	// Meta data
	var meta = require('../meta.json');

	app.post("/create-report", function (req, res) {

		console.log(req.body);

		var data = req.body;

		var newReport = {
            date: data.date,
            month: data.month,
            year: data.year,
            publish_date: data.publish_date,
            image: data.image_url,
            image_credit: data.image_credit,
            image_cutline: data.image_cutline,
            main_headline: data.main_hed,
            main_deck: data.main_deck,
            byline: data.byline,
            title: data.position,
            email: data.email,
            twitter: data.twitter_tag,
            intro: data.intro,
            blurb1_head: data.blurb1_head,
            blurb1: data.blurb1,
            blurb2_head: data.blurb2_head,
            blurb2: data.blurb2,
            blurb3_head: data.blurb3_head,
            blurb3: data.blurb3,
            blurb4_head: data.blurb4_head,
            blurb4: data.blurb4,
            texas_jobless_rate: data.texas_jobless_rate,
            dfw_jobless_rate: data.dfw_jobless_rate,
            jobless_head: data.jobless_head,
            jobless_chatter: data.jobless_chatter,
            industry_chatter: data.industry_chatter,
            state_employment: data.state_employment,
            state_explainer: data.state_explainer,
            chart_source: data.chart_source,
            cat1: data.cat1,
            cat1_amount: data.ca1_amount,
            cat2: data.cat2,
            cat2_amount: data.cat2_amount,
            cat3: data.cat3,
            cat3_amount: data.cat3_amount,
            cat4: data.cat4,
            cat4_amount: data.cat4_amount,
            cat5: data.cat5,
            cat5_amount: data.cat5_amount,
            cat6: data.cat6,
            cat6_amount: data.cat6_amount,
            cat7: data.cat7,
            cat7_amount: data.cat7_amount,
            cat8: data.cat8,
            cat8_amount: data.cat8_amount,
            cat9: data.cat9,
            cat9_amount: data.cat9_amount,
            cat10: data.cat10,
            cat10_amount: data.cat10_amount,
            cat11: data.cat11,
            cat11_amount: data.cat11_amount
		};

		req.model.texas_jobs.create(newReport, function(err) {
			console.log(newReport);	
			if(err){res.send(err);}
			res.send(newReport);
		});

	});

};
