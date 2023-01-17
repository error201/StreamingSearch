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
    var pageEl = $('body');
    var tmdbApiKey = "241112bdd32fa526246d8de7ad741118";
    var top10Tv = {};
    var movieCarousel = $('#movie-carousel');
    var tvCarousel = $('#tv-carousel');
    var youTubeApiKey = "AIzaSyC5udntgdnrUPAP9va88nAa674Ss1wWlmI";
    var onScreenObjects = [];
    getTopTenMovie();
    getTopTenTv();
    var topTenMovies = JSON.parse(localStorage.getItem('topTenMovies'));
    var topTenTV = JSON.parse(localStorage.getItem('topTenTV'));
    var watchList = JSON.parse(localStorage.getItem('watch-list'));
    var watchList = JSON.parse(localStorage.getItem('watchList'));     
    // populateCarouselMovie(topTenMovies.results);
    // populateCarouselMovie([]);
    // populateCarouselTV(topTenMovies);

    
    //Event Listeners---------------------------------------------
    $(document).ready(function(){
        //need to come to agreement on carousel functionality
        $('.modal').modal();
    });
    //updated eventlistener to listen for any decendent of body that was a card to resolve the issue that the watch list cards weren't present at the time of onload
    $('body').on('click', '.card', function(){
        console.log($(this).children('.card-title').text());
        titleDetails($(this).children('.card-title').text());
    });

    $('.watch-list-button').on('click', function(){
        launchWatchList();
    });

    $('.carousel').on('click', '.arrow', function(event){
        event.preventDefault();
        event.stopPropagation();
        moveCarousel($(this));
    });

    $('body').on('click', '.save-button', function(){
        updateWatchList($(this).parent().parent().children(".modal-header").children(".modal-title").text());
        console.log($(this).parent().parent().children(".modal-header").children(".modal-title").text())
    })

    
    //Functions----------------------------------------------------
    
    //streaming availability api fetch function
    //add seach limit protection so we dont go over 50 per day
    //API Key: 95154b8a57msha4e5c1348b5f178p1d6f1ejsn62dcb59bc28f
    function getUserQuery(input) {
    
    }
    
    //display search results in rows 4 columns wide
    function searchResults(array) {
    
    }
    
    //TMDB api fetch function
    function getTopTenTv() {
        var trendingTvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}`
        fetch(trendingTvUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.results)
                populateCarouselTV(data.results);
                $(document).ready(function(){
                    $('#tv-carousel').carousel({
                        padding: 10,
                        dist: 0,
                        fullWidth: true
                    });
                });
            });
    };
    
    function getTopTenMovie() {
        var trendingMovieUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}`
        return fetch(trendingMovieUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                populateCarouselMovie(data.results);
                $(document).ready(function(){
                    $('#movie-carousel').carousel({
                        padding: 10,
                        dist: 0,
                        fullWidth: true
                    });
                });
            });
    };
    
    // Youtube api fetch function
    async function getYoutubeTrailers(searchKeyword) {
        // console.log(searchKeyword);
        // var youTubeApiUrl = `https://www.googleapis.com/youtube/v3/search?q=${searchKeyword}%previewpart=snippet&order=relevance&type=video&videoDefinition=high&key=${youTubeApiKey}`;
        
        // var test = await fetch(youTubeApiUrl)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (data) {
        //         console.log(data);
        //         console.log(data.items[0].id.videoId);
        //         return data.items[0].id.videoId;
        //     });
        // return test;
        return '-XwSmZ5n_J4';
    };
    
    //place carousel card items in carousel
    function populateCarouselMovie(array) {
        //cut results down to the 10 top rated movies
        var results = array;
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
                description: element.overview,
                popularity: element.vote_average,
                poster: element.poster_path,
                backdrop: element.backdrop_path
            }
            onScreenObjects.push(cardObj);

            //establish card keys for use in modal and saving
            var card = $('<div class="carousel-item card modal-trigger" data-target="description-modal">');
            card.attr("style", `background-image: url(https://image.tmdb.org/t/p/w500/${element.backdrop_path})`);
            
            //title card, needs to appear on bottom
            var cardTitle = $('<div class="card-title left-align ">')
            cardTitle.text(cardObj.title);
            card.append(cardTitle);

            //save button should be on right side of title card, floating.
            var cardSave = $('<button class="save-button wgitaves-effect waves-light btn grey darken-2">');
            //save data from fetch in object array for use in modals and save feature
            cardSave.text('Add +');
            card.append(cardSave);

            movieCarousel.append(card);
        }
    }

    function populateCarouselTV(array) {
        //cut results down to the 10 top rated movies
        var results = array;
        results.sort(function(a, b){return b.popularity - a.popularity});
        var topRated = results.slice(0, 10);
    
        for (let i = 0; i < topRated.length; i++) {
            var element = topRated[i];
            //create and add title object to array for use in modals and save features
            var cardObj = {
                title: element.name,
                genres: element.genre_ids,
                media: element.media_type,
                release: element.first_air_date,
                description: element.overview,
                popularity: element.vote_average,
                poster: element.poster_path,
                backdrop: element.backdrop_path
            }
            onScreenObjects.push(cardObj);

            //establish card keys for use in modal and saving
            var card = $('<div class="carousel-item card modal-trigger" data-target="description-modal">');
            card.attr("style", `background-image: url(https://image.tmdb.org/t/p/w500/${element.backdrop_path})`);
            
            //title card, needs to appear on bottom
            var cardTitle = $('<div class="card-title left-align grey darken-2 text-grey text-darken-4">')
            cardTitle.text(cardObj.title);
            card.append(cardTitle);

            //save button should be on right side of title card, floating.
            var cardSave = $('<button class="save-button wgitaves-effect waves-light btn grey darken-2">');
            //save data from fetch in object array for use in modals and save feature
            cardSave.text('Add +');
            card.append(cardSave);

            tvCarousel.append(card);
        }
    }
    
    function moveCarousel(element){
        if(element.hasClass('movie-next')){
            $('#movie-carousel').carousel('next');
        } else if(element.hasClass('movie-previous')){
            $('#movie-carousel').carousel('next');
        }
        if(element.hasClass('tv-next')){
            $('#tv-carousel').carousel('next');
        } else if(element.hasClass('tv-previous')){
            $('#tv-carousel').carousel('next');
        }
    }

    //Launch modal for title information
    async function titleDetails(element) {
        var openedTitle = onScreenObjects.find(obj => obj.title === element);
        var genre = getGenre(openedTitle.genres);
        console.log(genre)
        var streamingServices = getStreamingService(openedTitle.title);
        //getting the trailer into modal using async functions.
        //can propably be written better but it works so were keeping it as is for now.
        async function getUrl(){
            returnedUrl = await getYoutubeTrailers(openedTitle.title).then(url => {
                return url;
            })
            return returnedUrl;
        }
        youTubeUrl = 'https://www.youtube.com/embed/' + await getUrl();
        
        //fill modal contents
        $('.modal-title').text(openedTitle.title);
        $('.modal-info').text(openedTitle.release + ' ' + genre + ' ' + (Math.round(openedTitle.popularity * 10) + '%'));
        $('.modal-description').text(openedTitle.description);
        $('.modal-trailer').attr('src', `${youTubeUrl}`);
        $('.modal-services').text(streamingServices);
        $('.modal-save').text('Add +');

    }
    
    //save button function
    function updateWatchList(element) {
        var savedTitle = onScreenObjects.find(obj => obj.title === element);
        if(watchList === null) {
            watchList = [];
        }
    
        var duplicate = false
        var duplicateIndex = 0
        for (let i = 0; i < watchList.length; i++) {
            const element = watchList[i];
            if(element.title === savedTitle.title) {
                duplicate = true
                duplicateIndex = i
            }
        }
        //Duplicate save
        if(duplicate === false) {
            watchList.push(savedTitle)
            localStorage.setItem('watchList', JSON.stringify(watchList))
        }
        else{
        //Move duplicate title to front of index
            watchList.splice(duplicateIndex, 1);
            watchList.unshift(savedTitle);
        }



    }
    
    
    //open watch list modal
    function launchWatchList() {
    //eventually make this input for user to give name and create multiple watch lists
    $('.watch-list-title').text('My Watch List');
    //populate watch list with saved titles
    console.log(watchList.length);
    for (let i = 0; i < watchList.results.length; i++) {
        var element = watchList.results[i];
        var watchListCard = $('<div class="card modal-trigger" data-target="description-modal">');
        watchListCard.attr("style", `background-image: url(https://image.tmdb.org/t/p/w500/${element.backdrop_path})`);
        var watchListCardTitle = $('<div class="card-title left-align ">')
        watchListCardTitle.text(element.title);
        watchListCard.append(watchListCardTitle);
        $('.watch-list-main').append(watchListCard);
        console.log('loop')
    }
    
    }
    //Create conditional logic to turn genre codes into appropriate strings
    //Return array of strings
    //
    function getGenre(array) {
        console.log(array)
        var genreList = [];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if(element == '28') {
                genreList.push("Action")
            }
            else if(element == '12') {
                genreList.push('Adventure')
            }
            else if(element == '16') {
                genreList.push('Animation')
            }
            else if(element == '35') {
                genreList.push('Comedy')
            }
            else if(element == '80') {
                genreList.push('Crime')
            }
            else if(element == '99') {
                genreList.push('Documentary')
            }
            else if(element == '18') {
                genreList.push('Drama')
            }
            else if(element == '10751') {
                genreList.push('Family')
            }
            else if(element == '14') {
                genreList.push('Fantasy')
            }
            else if(element == '36') {
                genreList.push('History')
            }
            else if(element == '27') {
                genreList.push('Horror')
            }
            else if(element == '10402') {
                genreList.push('Music')
            }
            else if(element == '9648') {
                genreList.push('Mystery')
            }
            else if(element == '10749') {
                genreList.push('Romance')
            }
            else if(element == '878') {
                genreList.push('Science Fiction')
            }
            else if(element == '10770') {
                genreList.push('TV Movie')
            }
            else if(element == '53') {
                genreList.push('Thriller')
            }
            else if(element == '10752') {
                genreList.push('War')
            }
            else if(element == '37') {
                genreList.push('Western')
            }
            else if(element == '878') {
                genreList.push('Science Fiction')
            }
            else if(element == '10759') {
                genreList.push('Action & Adventure')
            }
            else if(element == '10762') {
                genreList.push('Kids')
            }
            else if(element == '10763') {
                genreList.push('News')
            }
            else if(element == '10764') {
                genreList.push('Reality')
            }
            else if(element == '10765') {
                genreList.push('Sci-Fi & Fantasy')
            }
            else if(element == '10766') {
                genreList.push('Soap')
            }
            else if(element == '10767') {
                genreList.push('Talk')
            }
            else if(element == '10768') {
                genreList.push('War & Politics')
            }

        }
        return genreList;
    }

    function getStreamingService() {
    
    }

});



    