
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
	return {
		price: priceSnapshot.val(),
		twitter: twitterSnapshot.val(),
		volume: volumeSnapshot.val()
	}
}).then (function(data) {
	console.log(data);
	var parseTime = d3.timeParse("%Y-%m-%d");
	let priceData = []

	for (var key in data.price) {
		priceData.push({
			date: parseTime(data.price[key].date_timestamp),
			price: data.price[key].price,
		})
		console.log(data.price[key].date_timestamp)
		
	}
  // draw graph
  	var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	var x = d3.scaleTime()
	    .rangeRound([0, width]);

	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

	var line = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.price); });

	console.log(priceData)

	x.domain(d3.extent(priceData, function(d) { return d.date; }));
	y.domain(d3.extent(priceData, function(d) { return d.price; }));

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
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(priceData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
})




/*d3.tsv(twitterData, function(d) {
  d.date = parseTime(d.date);
  d.price = +d.price;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; })); */
