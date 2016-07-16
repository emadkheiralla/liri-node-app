var keys = require('./keys');
var spotify = require('spotify');
var twitter = require('twitter');
var imdb = require('imdb');
var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;

var action = process.argv[2];

if(action === 'tweet-this'){
	myTweets();
}else if(action == 'spotify-this'){
	spotifyThis();
}else if(action == 'movie-this'){
	movieThis();
}else if(action == 'do-this'){
	doThis();
}

function myTweets(){
	var params = {screen_name: 'EmadKheiralla'};
	var client = new twitter(keys.twitterKeys);
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error) {
		  	for (var i = 0; i < tweets.length; i++) {
		  		console.log(tweets[i].text);
		  	}
		  	console.log('=================================================================================================================');
		}
	});
}






function spotifyThis(){
	if(!process.argv[3]){
		var params = {type: 'track', query: 'The Sign'};
	}else{
		var params = {type: 'track', query: process.argv.slice(3).join(' ')};
	}

	spotify.search(params, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {  		
    		for (var i = 0; i < data.tracks.items.length; i++) {
	    		//console.log(data.tracks.items[i]);	    		
	    		console.log("Artist Name: " + data.tracks.items[i].artists[0].name);
	    		console.log("Song Name: " + data.tracks.items[i].name);
	    		console.log("Preview URL: " + data.tracks.items[i].preview_url);
		  		console.log("Album Name: " + data.tracks.items[i].album.name);
		  		console.log(" ");
    		}
    	}
    	console.log('=================================================================================================================');    
	});
}

function movieThis(){
	if(!process.argv[3]){
		var movie = "Mr. Nobody";
	}else{
		var movie = process.argv.slice(3).join(' ');
	}
	request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json&tomatoes=true', function (error, response, body) {

		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {

			var movieObject = JSON.parse(body);
			//console.log(movieObject);
			console.log("Movie Title: " + movieObject.Title);
    		console.log("Movie Year: " + movieObject.Year);
	  		console.log("Country produced: " + movieObject.Country);
	  		console.log("Movie Language: " + movieObject.Language);
	  		console.log("Actors: " + movieObject.Actors);
    		console.log("IMDB Rating: " + movieObject.imdbRating);
	  		console.log("Rotten Tomatoes Rating: " + movieObject.tomatoRating);
	  		console.log("Rotten Tomatoes User Rating: " + movieObject.tomatoUserRating);
	  		console.log("Rotten Tomatoes URL: " + movieObject.tomatoURL);
	  		console.log("Movie Plot: " + movieObject.Plot);
	  		console.log('=================================================================================================================');
		}
	});
}

function doThis(){
	var command = "node liri.js ";
	
	
	fs.readFile('random.txt', 'utf8', function (err, data) {
		if (err) {
			return console.error(err);
		}else{
			var cmd = data.split(',');
			for (var i = 0; i < cmd.length; i++) {
				command += cmd[i];
				command += " ";

			}
		}
		exec(command, function(error, stdout, stderr) {
		  // command output is in stdout
		    console.log(stdout);
		    fs.appendFile("log.txt", stdout, function(err) {
				if(err){
					console.log(err);
				}
			});
		});
	});
}


