$('#submit-btn').click(function loadData() {

	//Created new Jquery variables for our HTML id an classes//	
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    //Clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
	
	//Created new variables for street and city values//	
    var streetStr = $('#street').val();
	var cityStr = $('#city').val();
	var address = streetStr + ", " + cityStr;
	
	//Changed the text for greeting in html//	
	$greeting.text("So, you want to live at " + address + ", sounds exciting! ;)")
	
	/******************************* GOOGLEMAPS API*********************************/
	
	//Created a new URL variable including address info//
	var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';	
	
	//Added an image on the background to the body by using append method, and added our URL variable as a source of image//
	$body.append('<img class="bgimg" src = "' + streetviewUrl + '">');
	
	/******************************* NEWYORK TIMES API *******************************/
	
	//Created a new variable for nytimes URL and appended the 'city' string //
	var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=oldest&api-key=c6607a28e419d5492b0138df456786c4:18:74755325';
	
	//When we get the response back from that URL, run the function //
	$.getJSON(nytimesUrl, function (data){
		$nytHeaderElem.text("New York Times Articles About " + cityStr);
	
	//We take the 'docs' data. This is where all the information we need in	the response//
		articles = data.response.docs;
	
	//We go through all the articles 1 by 1 with this for loop//
	for (var i = 0; i < articles.length ; i++ ){
		 var article = articles[i];
		 
	//  There is 1 commone web-url (a href) for the headline and the snippet
	//  Then we append it to nytimes-articles in html, as an unordered list	
		$nytElem.append('<li class = "article">'+'<a href="'+ article.web_url + '">' + article.headline.main + '"</a>' + '<p>' + article.snippet +'</p>'+'</li>');		
	};
	//  At the end of our $.getJSON method, i created an error function in case Nytimes cant be loaded.
	}).error(function(e){
		$nytHeaderElem.text('New York Times could not be loaded');	
	});
	
	/******************************* WIKIPEDIA API *******************************/
	
	var wikisetTimeout = setTimeout(function(){
		$wikiElem.text("Failed to get Wikipedia sources");		
	},8000);

	
	//First, a new variable for wikipedia URL is created//
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
	
	//ajax request is created//
	$.ajax ({
		url: wikiUrl,
		dataType: "jsonp",
		success: function(response){
			var articleList = response[1];
			
	//When we get the response back. it has to loop through the articles//
			for(var i = 0; i < articleList.length ; i++){
				articleStr = articleList[i];
				
	//Here, we get article String, not city string. Because when clicked, we want it to direct us to the articles within the response we got from the wikipedia API //			
				var url = 'https://en.wikipedia.org/wiki/' + articleStr;
				
				$wikiElem.append('<li><a href ="' + url + '"/>'+'</a>'+ articleStr + '</li>');
				
			};	
			clearTimeout(wikisetTimeout);
		}		
	});
	
	
	
	
    event.preventDefault();
});


