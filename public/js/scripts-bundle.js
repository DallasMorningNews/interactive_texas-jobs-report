$(document).ready(function() {
	
	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE
	
	var d = new Date();
	var year = d.getFullYear();

	$('.copyright').text(year);




	function drawChart(targetDiv, data, datapoint) {

		// date parser
		var parseDate = d3.time.format("%b %Y").parse;

		console.log(datapoint);

		// creating our custom dataset based on the data and datapoint pased
		dataset = data.map(function(d) {
			console.log(d);
			return {
				month: parseDate(d.period),
				value: d[datapoint]
			}
		})

		console.log(dataset);

		// setting up the chart dimensions and margins
		var margin = {top: 5, right: 0, bottom: 30, left: 30},
			w = 280 - margin.left - margin.right,
			h = 220 - margin.top - margin.bottom;

		if (datapoint === "stateEmployment") {
			margin.left = 50;
			w = 280 - margin.left - margin.right;
		}

		// setting up the xScale. Ordinal for bar charts, based off the month property of the data
		var xScale = d3.scale.ordinal()
			.domain(dataset.map(function(d) {
				return d.month
			}))
			.rangeRoundBands([0, w], 0.2);


		// setting up the yScale. Min = 0. Max = 2 more than the max datapoint value
		
		var yScale = d3.scale.linear()
			.range([h, 0]);

		if (datapoint === "stateEmployment") {

			yScale.domain(
				[d3.min(dataset, function(d) {
					return (parseInt(d.value) - 5000)
				}), 
				d3.max(dataset, function(d)  {
					return (parseInt(d.value) + 5000)
				})]); 

			// yScale.domain(d3.extent(dataset, function(d){
			// 	return (parseInt(d.value) + 5000);
			// }))
		} else {
			yScale.domain([0, d3.max(dataset, function(d) {
					return (parseInt(d.value) + 2);
				})]);
		}

		// setting up the x axis. X Axis uses just the first letter of the month as its tick marker
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.outerTickSize(0)
			.tickFormat(function(d) {
				return d3.time.format("%b")(d).charAt(0)
			});

		// setting up the right axis. ticks represent datapoint value as a percentage
		
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.innerTickSize(- (w + margin.left))
			.outerTickSize(0)
			.tickPadding(10);			

		if (datapoint === "stateEmployment") {
			yAxis.ticks(6)
				.tickFormat(function(d) {
					return commafy(d);
				})
				.orient("left");
		} else {
			yAxis.ticks(3)
				.tickFormat(function(d) {
					return d + "%";
				})
				.orient("right");
		}

		// setting up a secondary x axis that marks the years under "januarys", using only the last two digits of the year
		var secondaryAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.outerTickSize(0)
			.tickFormat(function(d) {
				if (d3.time.format("%b")(d) === "Jan" || d === d3.min(dataset).month ) {
					return ("’" + d3.time.format("%Y")(d).slice(-2));
				} 
			});


		// appending an svg element to the targetDiv passed to the drawChart function
		var svg = d3.select("#" + targetDiv)
			.append("svg")
				.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.top + margin.bottom);

	
		// appending a g element for the yAxis
		svg.append("g")
			.attr("class", "axis yAxis")
			.attr("transform", "translate(0,5)")
			.call(yAxis);

		// appending horizontal grid lines
		var gridLines = d3.selectAll(".yAxis .tick")
			.append("line")
			.classed("gridLine", true)
			.attr("x1", margin.left)
			.attr("y1", 0)
			.attr("x2", w + margin.left)
			.attr("y2", 0)
			.attr("stroke-width", 1)
			.attr("stroke", "rgb(225,225,225)");


		//reseting the position of the y-Axis and gridlines for the texas jobs chart to account for larger numbers in the chart's y-axis

		if (datapoint === "stateEmployment") {
			d3.select("#" + targetDiv + " .yAxis")
				.attr("transform", "translate(50,5)");

			d3.selectAll("#" + targetDiv + " .yAxis .tick .gridLine")
				.attr("x1", "0");
		}

		// appending a g element for the bars, and positioning with the left and top margins
		var bars = d3.select("#" + targetDiv + " svg")				
				.append("g")
					.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");				

		// adding rectangles to the bars g element
		// also adds a mouseover event that displays the value and highlights the bar
		bars.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("x", function(d) {
					return xScale(d.month);
				})
				.attr("y", function(d) {
					return yScale(Math.max(0, d.value));
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) { 
					return Math.abs(yScale(d.value) - yScale(0)); 
				})
				.attr("fill", function(d) {
					if (d.value < 0) {
						return "#c80000";
					} else {
						return "#0185d3";
					}
				})
				.on("mouseover", function(d) {

					// grabbing the x position of the bar mousedover
					var xPosition = parseFloat(d3.select(this).attr("x"));

					// if that x position is more than half the width of the svg
					// set the x position so that the tooltip appears to the left of the bar
					// else, set the x position to the right of the bar
					if (xPosition > w / 2) {
						xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2 + margin.left - tooltipWidth;
					} else {
						xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2 + margin.left;
					}

					var yPosition = parseFloat(d3.select(this).attr("y")) + 3;

					d3.select(this).attr("fill", function(d) {
						if (d.value < 0) {
							return "#950000";
						} else {
							return "#01456e";
						}
					});

					d3.select("#" + targetDiv + " .toolTip")
						.attr("transform", "translate(" + xPosition + ", " + yPosition + ")")
						.classed("hidden", false);


					if (datapoint === "stateEmployment") {
						d3.select("#" + targetDiv + " .toolTip")
							.select("text")
								.text(commafy(d.value));
					} else {
						d3.select("#" + targetDiv + " .toolTip")
							.select("text")
								.text(d.value + "%");
					}


				})
				.on("mouseout", function() {
					d3.select("#" + targetDiv + " .toolTip")
						.classed("hidden", true);
					d3.select(this).attr("fill", function(d) {
						if (d.value < 0) {
							return "#c80000";
						} else {
							return "#0185d3";
						}
					})
				});


		var tooltipWidth;

		if (datapoint === "stateEmployment") {
			tooltipWidth = 50;
		} else {
			tooltipWidth = 40;
		}

		var tooltip = svg.append("g")
			.attr("class", "hidden toolTip");

		tooltip.append("rect")
			.attr("fill", "white")
			.attr("height", 20)
			.attr("width", tooltipWidth)
			.attr("stroke-width", 1)
			.attr("stroke", "rgb(121,121,121)")
			.attr("x", 0)
			.attr("y", 0);

		tooltip.append("text")
			.attr("y", 14)
			.attr("x", tooltipWidth / 2)
			.attr("text-anchor", "middle");

		// appending the g element for the x axis
		svg.append("g")
			.attr("class", "axis xAxis")
			.attr("transform", "translate(" + margin.left + ", " + h + ")")
			.call(xAxis);

		// appending the g element for the secondary x axis (the year markers)
		svg.append("g")
			.attr("class", "axis yearAxis")
			.attr("transform", "translate(" + margin.left + ", " + (h + margin.bottom - 15) + ")")
			.call(secondaryAxis);
	
	}

	var commafy = d3.format(",")


	drawChart("chart1", jobsReport, "texas");
	drawChart("chart2", jobsReport, "dfw");
	drawChart("chart3", jobsReport, "stateEmployment");



	//////////////////////////////////////////////////////
	///// BLURB CARDS ////////////////////////////////////
	//////////////////////////////////////////////////////


	var currentCard = 0; // card we are currently on. defaults to 0, based on 0-index array of li items

	// find out how many cards we have, based on how many li items are in the nav
	// li items are dynamically build based on what's returned from the database
	var totalCards = $('#blurbNav ul li').length - 1; 


	// changing which blurb card is currently being viewed
	function swapCard(cardNumber) {
		$('.blurb').addClass('hidden');
		$('.blurb').eq(cardNumber).removeClass('hidden');
	}

	// clicking on blurbNav li
	$('#blurbNav ul').on('click', 'li', function() {

		// clearing the timer that rotates cards
		clearInterval(blurbTimer)

		// update which nav element has the active display styles
		$('#blurbNav ul li').removeClass('activeBlurb');
		$(this).addClass('activeBlurb');

		// grab the index of the li clicked on
		var i = $(this).index();

		// pass that index to the swapCard function to display the corresponding blurb card
		swapCard(i);
	})


	// clicking the view all button
	$('#viewAll').click(function() {

		// clear the timer that rotates the cards
		clearInterval(blurbTimer);

		// display all the blurbs
		$('.blurb').removeClass('hidden');

		// hide the blurb nav and the number 
		$('#blurbNav').toggleClass('hidden');
		$('#blurbs h4 .number').toggleClass('hidden');
	});

	// timer that rotates cards every 30 seconds
	var blurbTimer = setInterval(function() {
		if (currentCard < totalCards) {
			currentCard++;
		} else {
			currentCard = 0;
		}

		swapCard(currentCard);
		$('#blurbNav ul li').removeClass('activeBlurb');
		$("#blurbNav ul li").eq(currentCard).addClass('activeBlurb');
	}, 30000)

	blurbTimer;	


	//////////////////////////////////////////////////////
	///// BUILDING THE MONTH/YEAR DROPDOWNS //////////////
	//////////////////////////////////////////////////////


	var monthsArray = ["January", "February", "March", "April","May", "June", "July", "August", "September", "October", "November", "December"];

	var lastMonth = lastDate.getMonth();
	var lastYear = lastDate.getFullYear();

	var selectedYear;
	var selectedMonth;

	var initialYear = 2015;

	var currentYear = parseInt(year);

		for (i = initialYear; i <= lastYear; i++) {
			option = "<option value='" + i + "'>" + i + "</option>";
			$("#year").append(option);
		} 


	

	$('#year').change(function() {
		

		$("#year option:selected").each(function() {
			selectedYear = $(this).text();
		})

		buildMonths(selectedYear);
	})

	$('#month').change(function() {

		

		$("#month option:selected").each(function() {
			selectedMonth = $(this).text().substring(0,3);
		})

		$(".viewReport").removeClass('hidden').attr("href", "/texas-jobs-report/reports/" + selectedYear + "/" + selectedMonth);


	})


	// if year selected < = current year
		// build months with for loop, 0-12
	// else if year selected  = current year
		// build months with for loop, starting at 0, and counting up to current month


	function buildMonths(selectedYear) {

		$('#month').empty();
		selectedYear = parseInt(selectedYear);

		$('#month').append("<option value='' disabled selected>Month</option>");

		if (selectedYear < year && selectedYear !== 2015) {
			console.log('true');
			for (i=0; i<12; i++) {
				option = "<option value='" + monthsArray[i] + "'>" + monthsArray[i] + "</option>";
				$("#month").append(option);
			} 
		} else if (selectedYear == 2015) {

			for (i=9; i<12; i++) {
				option = "<option value='" + monthsArray[i] + "'>" + monthsArray[i] + "</option>";
				$("#month").append(option);
			}

		} else {
			for (i=0; i <= lastMonth; i++) {
				option = "<option value='" + monthsArray[i] + "'>" + monthsArray[i] + "</option>";
				$("#month").append(option);
			}
		}

		$('#month').removeClass('hidden');

	}

	/*
	------------------------------------------------------------------------------------------
	CODE FOR SLIDESHOWS, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE

	//setting up variables for the slideshow

	var slideCounter = 0,
		$nextButton = $('.nextButton'),
		$previousButton = $('.previousButton'),
		$slideButton = $('.slideButton');
		$slideCutline = $('.slide .cutline'),
		totalSlides = $('.slide').length,
		$slideshow = $('.slideshow'),
		slideHeight = $('.slide img').height();

	// checks which image we're on in the slideshow
	// if it's the first, hide the previous button
	// if it's the last, hide the next button
	// else show the previous and last buttons 

	function slidePosition() {
		if (slideCounter === 0) {
			$previousButton.hide();
		} else if ( slideCounter === (totalSlides - 1) ) {
			$nextButton.hide();
		} else {
			$previousButton.show();
			$nextButton.show();
		}
	}

	// advancing the slideshow by moving the current slide to the right
	// then moving the next slide in from the left
	// afterward, grab the file path and assign it to the next image's src attribute
	// then check where we are in the slideshow

	function advanceSlide() {
		slideCounter ++;
		$(this).siblings('.current').addClass('postSlide').removeClass('current');
		$(this).siblings('.slide').eq(slideCounter).addClass('current').removeClass('preSlide');
		var defaultImage = $(this).siblings('.slide').eq(slideCounter + 1).data('default');
		var srcset = $(this).siblings('.slide').eq(slideCounter + 1).data('srcset');
		$(this).siblings('.slide').eq(slideCounter + 1).children('img').attr('src', defaultImage).attr('srcset', srcset);;
		slidePosition();
	}

	function swipeAdvance() {

		if (slideCounter < totalSlides -1 ) {
			slideCounter ++;
			$(this).children('.current').addClass('postSlide').removeClass('current');
			$(this).children('.slide').eq(slideCounter).addClass('current').removeClass('preSlide');
			var defaultImage = $(this).children('.slide').eq(slideCounter + 1).data('default');
			var srcset = $(this).children('.slide').eq(slideCounter + 1).data('srcset');
			$(this).children('.slide').eq(slideCounter + 1).children('img').attr('src', defaultImage).attr('srcset', srcset);;
			slidePosition();
		}

	}

	// rewind the slideshow by moving the current slide to the left
	// then move the previous slide back into view from the left
	// then check where we are in the slideshow 

	function rewindSlide() {
		slideCounter --;
		$(this).siblings('.current').addClass('preSlide').removeClass('current');
		$(this).siblings('.slide').eq(slideCounter).addClass('current').removeClass('postSlide');
		slidePosition();
	}

	function swipeRewind() {
		if (slideCounter > 0 ) {
			slideCounter --;
			$(this).children('.current').addClass('preSlide').removeClass('current');
			$(this).children('.slide').eq(slideCounter).addClass('current').removeClass('postSlide');
			slidePosition();
		}
	}

	// append a number and total length of slideshow to each cutline 

	$slideCutline.each(function(k,v) {
		var cutlinePrefix = "<strong> Slideshow — " + (k + 1) + " of " + totalSlides + ":</strong> ";
		$(this).prepend(cutlinePrefix);
	})

	//running the slidePosition initially to hide previous button
	slidePosition();

	//setting the slideshow button position to be halfway down the slideshow
	console.log (slideHeight);
	$slideButton.css('top', ( (slideHeight / 2) - ($slideButton.height() / 2) ) )

	//binding click and swipe events to the next and previous button

	$nextButton.on('click', advanceSlide);
	$previousButton.on('click', rewindSlide);

	// if you want to be able to swipe the slideshow on touch devices, un-note the following two lines
	// and make sure you call jquery.swipe.min.js in the index file

	$slideshow.on("swipeleft", swipeAdvance);
	$slideshow.on("swiperight", swipeRewind);

	DELETE THIS ENTIRE LINE */






	/*
	------------------------------------------------------------------------------------------
	CODE FOR DROP BULLETS, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	

	var $dropHead = $('.dropList .dropHed'),
		$dropTweet = $('.dropList .fa-twitter');

	$dropHead.on('click', function(){
		$(this).next(".dropText").slideToggle(200); 
		$(this).find(".fa").toggleClass('fa-plus').toggleClass('fa-minus');
	});

	$dropTweet.on("click", function(){
		var shareID = $(this).closest(".dropList").attr("id"),
			shareURL = "&url="+encodeURIComponent(window.location.href + "#" + shareID),
			shareText = encodeURIComponent($(this).closest(".dropList").find("h4").text()),
			shareLink = "https://twitter.com/intent/tweet?text="+ shareText + shareURL + "&via=dallasnews";
		window.open(shareLink, '_blank');
	});

	DELETE THIS ENTIRE LINE */




	/*
	------------------------------------------------------------------------------------------
	CODE FOR SYNOPSIS BLOCK, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	

	$(".synopsis p").on("click", function() {
		var shareURL = "&url=" + encodeURIComponent(window.location.href),
			shareText = $(this).text(),
			twitterTag = "dallasnews";
			
		var maxLength = 97 // maximum number of characters to extract

		var trimmedText = shareText.substr(0, maxLength);

		trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")))

		trimmedText = trimmedText.slice(1);

		trimmedText += " ... "

		trimmedText = encodeURIComponent(trimmedText); 
		
		var shareLink = "http://twitter.com/intent/tweet?text=" + trimmedText + shareURL + "&via=" + twitterTag;
		window.open(shareLink, "_blank");
	})

	DELETE THIS ENTIRE LINE */




	/*
	------------------------------------------------------------------------------------------
	NDN VIDEO ASPECT RESIZER, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	  

	//caching a pointer to the jquery element

	var $videoWrapper = ''

	if ($('.ndn_embed')) {
		$videoWrapper = $('.ndn_embed');
		scaleVideo();
	}

		function scaleVideo() {

			videoWidth = $videoWrapper.width(); //grabs the width of the video player
			videoHeight = videoWidth * .5625; //sets a variable equal to 56.25% of the width (the correct aspect ratio for the videos)

			$videoWrapper.css('height', videoHeight); //assings that height variable as the player's height in the css
		}


	$(window).resize(function() {
		scaleVideo(); //runs the video aspect resizer when the width of the browser is changed
	})

	DELETE THIS ENTIRE LINE */


});

// $(window).load(function() {
// 	console.log(jobsReport);
// })
