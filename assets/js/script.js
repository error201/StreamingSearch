//TODO: Be able to search for a specific movie title
//1. Take user input and search stream availability api for cinema that matches.
//a. Place a saftey mechanisim on this fetch that prevents more than 50 fetches per day.
//2. Take response from stream ability and store it in local storage as "testQuery".
//a. Use testQuery during testing and production
//TODO: Have search results displayed on the page.
//1. Display search results as img cards with class="title".
//2. Display search in rows with 4 columns per row.
//3. Have modal with title details appear upon card click.
//4. Have save button in modal to add title to watch list.
//a. Likely, we sould add a save put hovering over the one of the bottom corners of title while it is a search result card.

//TODO: Have a carousel of top 10 movies under search bar onload.
//1. Display top ten api results in carousel.
//2. Have modal with title details appear upon card click.
//3. Have save button in modal to add title to watch list.
//TODO: Have ability to save movies to a watch list.
//1. Add selected title and its details to array in local storage.
//TODO: Have ability to view watch list.
//1. Have watch list modal appear upon clicking watch list button.
//a. location of watch-list button needs to be determined.

//Global Variables---------------------------------------------
var tmdbApiKey = "241112bdd32fa526246d8de7ad741118";
var top10Tv = {};
var top10Movies = {};



//Event Listeners----------------------------------------------




//Functions----------------------------------------------------

//streaming availability api fetch function
//add seach limit protection so we dont go over 50 per day
//API Key: 95154b8a57msha4e5c1348b5f178p1d6f1ejsn62dcb59bc28f
function getUserQuery(input) {

}

//display search results in rows 4 columns wide
function searchResults(array) {

}

// TMDB api fetch function
function getTopTenTv() {
    var trendingTvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}`
    fetch(trendingTvUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
};

function getTopTenMovie() {
    var trendingMovieUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}`
    fetch(trendingMovieUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
};

//place carousel card items in carousel
function populateCarousel(array) {

}


//Launch modal for title information
function titleDetails(element) {

}

//save button function
function updateWatchList(element) {

}

//open watch list modal
function launchWatchList() {

}
