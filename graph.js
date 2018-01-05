
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCquEBxjrnG9hvXy82GF-E0TFO-_CDRC7I",
    authDomain: "project1-2f2d7.firebaseapp.com",
    databaseURL: "https://project1-2f2d7.firebaseio.com",
    projectId: "project1-2f2d7",
    storageBucket: "project1-2f2d7.appspot.com",
    messagingSenderId: "337608536946"
  };
  firebase.initializeApp(config);

const database = firebase.database();

Promise.all([
  database.ref('/Price/').once('value'),
  database.ref('/Twitter/').once('value'),
  database.ref('/Trading Volume').once('value')
]).then(([priceSnapshot, twitterSnapshot, volumeSnapshot]) => {
	var priceVal = priceSnapshot.val()
	var tmp = {}
	for (var key in priceVal) {
		if (moment(priceVal[key].date_timestamp).isAfter('2017-12-20')) {
			tmp[key] = priceVal[key]
		}
	}
	return {
		price: tmp,
		twitter: twitterSnapshot.val(),
		volume: volumeSnapshot.val()
	}
}).then (function(data) {
	var parseTime = d3.timeParse("%Y-%m-%d");
	let priceData = []
	var sentimood = new Sentimood();
	let twitterData = []
	let twitterDates = {}

	for (var key in data.price) {
		twitterDates[data.price[key].date_timestamp] = {
			sentiment: 0,
			count: 0
		}
		priceData.push({
			date: parseTime(data.price[key].date_timestamp),
			price: data.price[key].price,
		})
	}

	for(var key in data.twitter) {
		var date = moment(data.twitter[key].date_timestamp, 'ddd MMM DD kk:mm:ss +0000 YYYY').format('YYYY-MM-DD')
		var score = sentimood.analyze(data.twitter[key].twitterText).score
		if (twitterDates[date]) {
			twitterDates[date].sentiment += score
			twitterDates[date].count++
		}
	}

	for (var date in twitterDates) {
		var sentiment = 0;
		var price = priceData.find(function(row) {
			return d3.timeFormat('%Y-%m-%d')(row.date) == date
		})

		if (twitterDates[date].count > 0) {
			sentiment = twitterDates[date].sentiment / twitterDates[date].count
		}
		twitterData.push({ date: parseTime(date), sentiment, price: price.price })
	}
  // draw graph
  	var svg = d3.select("svg"),
    margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime()
	    .rangeRound([0, width]);

	var y0 = d3.scaleLinear()
	    .rangeRound([height, 0]);

	var y1 = d3.scaleLinear()
	    .rangeRound([height, 0]);

	var line = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y0(d.price); });

	var line1 = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { 
	    	return y1(d.sentiment); 
	    });

	x.domain(d3.extent(priceData, function(d) { return d.date; }));
	y0.domain(d3.extent(priceData, function(d) { return d.price; }));
	y1.domain(d3.extent(twitterData, function(d) { return d.sentiment; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m-%d')))
      .selectAll("text")
      	.style("text-anchor","end")
      	.attr("dx", "-.8em")
      	.attr("dy", ".15em")
      	.attr("transform", "rotate(-65)")
      .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y0))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .data([twitterData])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

   g.append("g")
      .call(d3.axisRight(y1)).attr("transform", "translate( " + width + ", 0 )")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Twitter Sentiment");

  g.append("path")
  	  .data([twitterData])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);
})




/*d3.tsv(twitterData, function(d) {
  d.date = parseTime(d.date);
  d.price = +d.price;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; })); */
