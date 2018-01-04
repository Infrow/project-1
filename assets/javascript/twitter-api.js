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
  var db = firebase.database();

  $(document).ready(function(){
  	displayHome("home-div");
  });

  var bearerToken = "";

  function displayHome(divToDisplay){
  	//console.log("Entering - In the Display Home Function");
  	var divClass = "#"+divToDisplay;
  	$("#main-container > div").each(function(){
  		if($(this).attr("id") && $(this).attr("id")!==divToDisplay){
  			$("#"+$(this).attr("id")).attr("class", "hide-div");
  		}
  	});
  	$(divClass).attr("class", "show-div");
  	//console.log("Leaving - In the Display Home Function");
  }

  $(document).on("click", "#sidebar-list", function(event){
  	var url = event.target.href;
  	var divId = url.split("#").pop().trim();
  	displayHome(divId);
  });

  $("#refresh-tweets").click(function(event){
  	//console.log("In the refresh tweets function");
  	event.preventDefault();


  	var consumerKey = "1BymWy7tskYwK1n7Pm6GYXO37";
  	var consumerSecret = "rVCNILUADJNUJfn7s7NHQ2x8bpZgnixpfavBYjlRkyyBpV5YMJ";
  	var bearer_token_credentials = consumerKey + ":" + consumerSecret;
  	var baseEcoded_bearerToken = $.base64.encode(bearer_token_credentials)
  	var tokenURL = "https://shielded-hamlet-43668.herokuapp.com/https://api.twitter.com/oauth2/token";
  	var bearerRequest={
  		'grant_type':'client_credentials'
  	};

  	var queryUrl = "https://shielded-hamlet-43668.herokuapp.com/https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=BTCTN&trim_user=1&exclude_replies=true";

  	//console.log("Before the AJAX Call");
/*
  	$.ajax({
  		url:tokenURL,
  		method:"POST",
  		headers:{
  			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
  			'Authorization':'Basic M0R1TFl6cjY5UjNyeWpRaG1vemp1aG1zMTpOWWkxamFIYVE2OWdjVnJ4c21MSFJKUEZrNFpHbHhRcUZnUWxDZEJvam5ibkVwamdUWg=='//,
  		},
  		data: bearerRequest
  	}).done(function(response){
  		//console.log("In the response of the first call - " + response);
  		bearerToken = response.access_token;
  		bearerToken = "Bearer " + bearerToken;

  		console.log(bearerToken);

  		$.ajax({
  			url:queryUrl,
  			method:"GET",
  			headers:{
  				'Authorization': bearerToken
  			}
  		}).done(function(resp){
  			console.log("In the response of the second call - " + resp);
  			resp.forEach(function(item){
  				var twitter_DateTimeStamp = item.created_at;
  				var twitter_text = item.text;
  				var twitter_epochDateTimeStamp = moment(twitter_DateTimeStamp).format('X');

  				db.ref('Twitter/' + twitter_epochDateTimeStamp).set({
  					date_timestamp : twitter_DateTimeStamp,
  					twitterText : twitter_text,  					
  				});
  			});
  		});
  	});
  	*/
  	var bearerToken = "Bearer AAAAAAAAAAAAAAAAAAAAACK83gAAAAAAXxr3vzT0x%2BPZ6ehskala8fFd9TU%3DxMdOPvsMckpji0BNdrsbQd1bhcT70jagkZRzBbnWLLi3EHBtbE";

  	$.ajax({
		url:queryUrl,
		method:"GET",
		headers:{
			'Authorization': bearerToken
		}
  	}).done(function(response){
  		console.log(response);
		response.forEach(function(item){
			var twitter_DateTimeStamp = item.created_at;
			var twitter_text = item.text;
			var twitter_epochDateTimeStamp = moment(twitter_DateTimeStamp).format('X');

			db.ref('Twitter/' + twitter_epochDateTimeStamp).set({
				date_timestamp : twitter_DateTimeStamp,
				twitterText : twitter_text,  					
			});
		});

		
	  	db.ref('Twitter/').orderByKey().on("value", function(snapshot){

			$.each(snapshot.val(), function(key, value) {

			  var time = moment(value.date_timestamp).format("MMMM Do, YYYY");
			  var tweets_text = value.twitterText;
			  var row = $("<tr>");
			  var td1 = $("<td>");
			  td1.text(time);
			  var td2 = $("<td>");
			  td2.text(tweets_text);
			  td2.attr('class', 'text-left');
			  row.append(td1);
			  row.append(td2);

			  $('#tweet-data > tbody').append(row);
			});	  		

	  	}, function(e){
	  		console.log("Exception occured while fetching tweets - " + e);
	  	})
		
  	});

  });

  $("#refresh-bitcoin-data").click(function(event){
  	event.preventDefault();

  	//code to refresh the bitcoin price for last 35 days
  	var priceUrl = "https://api.coindesk.com/v1/bpi/historical/close.json";

  	$.ajax({
  		url: priceUrl,
  		method: 'GET'
  	}).done(function(response){
  		resp = $.parseJSON(response);
  		$.each(resp.bpi, function(key, value){
  			//console.log(key, value);
  			var price_dateTimeStamp = key;
  			var price_value = value;
  			var price_date_epochVal = moment(price_dateTimeStamp).format('X');

  			db.ref('Price/' + price_date_epochVal).set({
  				date_timestamp: price_dateTimeStamp,
  				price: price_value
  			});
  		});

  		//retrieve the price data and display on the UI
	  	db.ref('Price/').orderByKey().on("value", function(snapshot){

			$.each(snapshot.val(), function(key, value) {

			  var time = moment(value.date_timestamp).format("MMMM Do, YYYY");
			  var price = value.price;
			  var row = $("<tr>");
			  var td1 = $("<td>");
			  td1.text(time);
			  td1.attr('class', 'text-left');
			  var td2 = $("<td>");
			  td2.text(price);
			  td2.attr('class', 'text-left');
			  row.append(td1);
			  row.append(td2);

			  $('#price-data > tbody').append(row);
			});	  		

	  	}, function(e){
	  		console.log("Exception occured while fetching tweets - " + e);
	  	})  		

  	});

  	//code to refresh the trading volume
  	var tradingUrl = "https://shielded-hamlet-43668.herokuapp.com/https://api.blockchain.info/charts/transactions-per-second?timespan=5weeks&rollingAverage=8hours&format=json";

  	$.ajax({
  		url: tradingUrl,
  		method: 'GET'
  	}).done(function(response){
  		//console.log(response.values);

  		$.each(response.values, function(key, value){
  			// console.log(value.x, value.y);
  			db.ref('Trading Volume/' + value.x).set({
  				volume: value.y
  			});
  		});

  		//retrieve the trading volume and display on the UI
	  	db.ref('Trading Volume/').orderByKey().on("value", function(snapshot){

			$.each(snapshot.val(), function(key, value) {

			  console.log(moment.unix(key).format('MMMM Do, YYYY h:mm:ss A'));
			  var time = moment.unix(key).format('MMMM Do, YYYY h:mm:ss A');
			  var volume = value.volume;

			  var row = $("<tr>");
			  var td1 = $("<td>");
			  td1.text(time);
			  td1.attr('class', 'text-left');
			  var td2 = $("<td>");
			  td2.text(volume);
			  td2.attr('class', 'text-left');
			  row.append(td1);
			  row.append(td2);

			  $('#volume-data > tbody').append(row);
			});	  		

	  	}, function(e){
	  		console.log("Exception occured while fetching tweets - " + e);
	  	}) 

  	});

  });