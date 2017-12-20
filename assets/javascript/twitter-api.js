  // Initialize Firebase
  var config = {
  	apiKey: "AIzaSyBr-PxWyEQMARryEV9xDe5XuKuiT3ssHAo",
  	authDomain: "first-project-d35f6.firebaseapp.com",
  	databaseURL: "https://first-project-d35f6.firebaseio.com",
  	projectId: "first-project-d35f6",
  	storageBucket: "first-project-d35f6.appspot.com",
  	messagingSenderId: "489578956869"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

  $(document).ready(function(){
  	displayHome("home-div");
  });

  function displayHome(divToDisplay){
  	var divClass = "#"+divToDisplay;
  	$("#main-container > div").each(function(){
  		if($(this).attr("id") && $(this).attr("id")!==divToDisplay){
  			$("#"+$(this).attr("id")).attr("class", "hide-div");
  		}
  	});
  	$(divClass).attr("class", "show-div");
  }

  $(document).on("click", "#sidebar-list", function(event){
  	var url = event.target.href;
  	var divId = url.split("#").pop().trim();
  	displayHome(divId);
  });

  $("#refresh-tweets").click(function(event){
  	console.log("1");
  	event.preventDefault();
  	var queryUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=BTCTN&trim_user=1&exclude_replies=true";
  	$.ajax({
  		url: queryUrl,
  		headers: {
  			'oauth_consumer_key': 'wlqusjUYjhEXy1mQm1SoywYWC',
  			'oauth_token': '125404150-Cub55OxjXFUNXR7sZycmDoalyj5iGik3R0T617y1',
  			'oauth_signature_method': 'HMAC-SHA1',
  			'oauth_timestamp': moment(moment.now()).unix(),
  			'oauth_nonce': 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
  			'oauth_version': '1.0',
  			'oauth_signature': 'SRrXrDVzLgHswGhs9InAeM6v%2F8M%3D'
  		},
  		method: "GET"
  	}).done(function(response){
  		console.log(response);
  	});
  });