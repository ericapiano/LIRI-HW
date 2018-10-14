const request = require("request");

const Spotify = require("node-spotify-api");

const moment = require("moment");

var fs = require("fs");

// turn on .env to load up envt variables from .env files

require("dotenv").config();

var keys = require("./keys");

const spotifyKeys = keys.spotify;

const spotify = new Spotify(spotifyKeys);

// Function for OMDB
  var movieThis = function(functionInfo) {

    if (functionInfo === '') {
      functionInfo = "Mr. Nobody"
    }

  request("http://www.omdbapi.com/?t=" + functionInfo.replace(" ", '+') +"&y=&plot=short&apikey=trilogy", function(error, response, body) {

  if (!error && response.statusCode === 200) {
    
    console.log(JSON.parse(body).Ratings[1]);
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating + 
    "\n title: " + JSON.parse(body).Title + 
    "\n year: " + JSON.parse(body).Year + 
    "\n IMBD rating: " + JSON.parse(body).Ratings[0].Value +
    "\n Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value +
    "\n country: " + JSON.parse(body).Country +
    "\n language: " + JSON.parse(body).Language + 
    "\n plot: " + JSON.parse(body).Plot + 
    "\n actors: " + JSON.parse(body).Actors
  );
  }
});


}

//function for Bands in Town

var bandsInTown = function(functionInfo) {

  console.log("https://rest.bandsintown.com/artists/" + functionInfo.replace(" ", '') +"/events?app_id=codingbootcamp")
  request("https://rest.bandsintown.com/artists/" + functionInfo.replace(" ", '') +"/events?app_id=codingbootcamp", function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var answer = JSON.parse(body);


    var datetime = moment(answer[0].datetime.split("T")[0], "YYYY-MM-DD").format("MM-DD-YYYY");
    
    console.log(`
    Venue Name: ${answer[0].venue.name}
    Venue location: ${answer[0].venue.country}
    Event Date: ${datetime}
    `);
  }
});


}

// function for do-what-it-says

function doIt () {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // console.log(error, data);
    var response = data.split(",")
    userChoice(response[0], response[1]);
  });
}




// function for Spotify


var userChoice = function (choice, functionInfo) {
  switch(choice){
    case "concert-this":
    bandsInTown (functionInfo);
    break;
    case "spotify-this-song":
    spotifyThis (functionInfo);
    break;
    case "movie-this":
    movieThis (functionInfo);
    break;
    case "do-what-it-says":
    doIt();
    break;
    default: console.log("that is not a command")

  }
}

var spotifyThis = function (functionInfo) {


  searchQuery = functionInfo;
  console.log(searchQuery);
  if (!searchQuery) {

      searchQuery = "I Saw The Sign"
  }

    spotify.search({ type: 'track', query: searchQuery}, function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
      } else {
        console.log(
          `Artist: ${data.tracks.items[0].album.artists[0].name}
          Title: ${data.tracks.items[0].name}
          Album Name: ${data.tracks.items[0].album.name}
          Link: ${data.tracks.items[0].preview_url}
        `)
      }
    })
}

var query = '';
for(var i = 3; i < process.argv.length; i++){
  query += ' ' + process.argv[i]
}

userChoice (process.argv[2], query); 
