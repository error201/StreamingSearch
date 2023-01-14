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


$ (function(){
    //Global Variables---------------------------------------------
    var tmdbApiKey = "241112bdd32fa526246d8de7ad741118";
    var top10Tv = {};
    var movieCarousel = $('#movie-carousel')
    var youTubeApiKey = "AIzaSyC5udntgdnrUPAP9va88nAa674Ss1wWlmI";
    var onScreenObjects = [];
    getTopTenMovie();
    var topTenMovies = JSON.parse(localStorage.getItem('topTenMovies'));
    populateCarousel(topTenMovies);
    
    //Event Listeners---------------------------------------------
    $(document).ready(function(){
        //need to come to agreement on carousel functionality
        $('.carousel').carousel({
            padding: 10,
            dist: -10
        });
        $('.modal').modal();
    });
    
    $('.card').on('click', function(){
        titleDetails($(this).children('.card-title').text());
    });
    
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
                localStorage.setItem('topTenMovies', JSON.stringify(data));
            });
    };
    
    // Youtube api fetch function
    function getYoutubeTrailers(searchKeyword) {
        var youTubeApiUrl = `https://www.googleapis.com/youtube/v3/search?q=${searchKeyword}part=snippet&order=relevance&type=video&videoDefinition=high&key=${youTubeApiKey}`;
        fetch(youTubeApiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            });
    };
    
    //place carousel card items in carousel
    function populateCarousel(array) {
        //cut results down to the 10 top rated movies
        var results = array.results;
        results.sort(function(a, b){return b.popularity - a.popularity});
        var topRated = results.slice(0, 10);
    
        for (let i = 0; i < topRated.length; i++) {
            var element = topRated[i];
            //create and add title object to array for use in modals and save features
            var cardObj = {
                title: element.title,
                genres: element.genre_ids,
                media: element.media_type,
                release: element.release_date,
                popularity: element.popularity,
                poster: element.poster_path,
                backdrop: element.backdrop_path
            }
            onScreenObjects.push(cardObj);

            //establish card keys for use in modal and saving
            var card = $('<div class="carousel-item card">');
            card.attr("style", `background-image: url(https://image.tmdb.org/t/p/w500/${element.backdrop_path})`);
            
            //title card, needs to appear on bottom
            var cardTitle = $('<div class="card-title left-align grey darken-2 text-grey text-darken-4">')
            cardTitle.text(cardObj.title);
            card.append(cardTitle);

            //save button should be on right side of title card, floating.
            var cardSave = $('<button class="waves-effect waves-light btn grey darken-2">');
            //save data from fetch in object array for use in modals and save feature
            cardSave.text('Add +');
            card.append(cardSave);

            movieCarousel.append(card);

        }
    
    
    }
    
    
    //Launch modal for title information
    function titleDetails(element) {
        console.log(element);
        var openedTitle = onScreenObjects.find(obj => obj.title === element);
        var modal = $('<div class="modal">');
        var modalContent = $('<div class="modal-content">');
        var modalHeader = $('<h4 class="modal-header">');
        var modalInfo = $('<p class="modal-info">');
        var modalDescription = $('<p class="modal-description">');
        var modalTrailer = $('<div class="modal-trailer">');
        var modalFooter = $('<p class="modal-footer">');
        
        modalHeader.text(openedTitle.title);
        modalInfo.text(openedTitle.release)
    }
    
    //save button function
    function updateWatchList(element) {
    
    }
    
    //open watch list modal
    function launchWatchList() {
    
    
    }
    
    getYoutubeTrailers('They Live movie trailer');

    });



    