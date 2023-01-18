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


$(function () {
    //Global Variables---------------------------------------------
    var pageEl = $('body');
    var tmdbApiKey = "241112bdd32fa526246d8de7ad741118";
    var top10Tv = {};
    var movieCarousel = $('#movie-carousel');
    var tvCarousel = $('#tv-carousel');
    var searchTextEl = $('#search-bar')
    var youTubeApiKey = "AIzaSyC5udntgdnrUPAP9va88nAa674Ss1wWlmI";
    var onScreenObjects = [];
    getTopTenMovie();
    getTopTenTv();
    var watchList = JSON.parse(localStorage.getItem('watchList'));
    var vw = Math.round($(window).width()/100);
    var vh = Math.round($(window).height()/100);
    //Event Listeners---------------------------------------------
    $(document).ready(function () {
        $('.modal').modal();
    });

    //updated eventlistener to listen for any decendent of body that was a card to resolve the issue that the watch list cards weren't present at the time of onload
    $("#search-button").on("click", function(event){
        event.preventDefault();
        var searchedText = $(searchTextEl).val();
        getUserQuery(searchedText);
    });

    $('body').on('click', '.card', function () {
        console.log($(this))
        console.log($(this)[0].id)
        titleDetails($(this)[0].id);
    });

    $('body').on('click', '.search-card', function(){
        console.log($(this))
        console.log($(this)[0].attributes.title)
        titleDetails($(this)[0].title);
    })

    $('.watch-list-button').on('click', function () {
        launchWatchList();
    });

    $('.carousel').on('click', '.arrow', function (event) {
        event.preventDefault();
        event.stopPropagation();
        moveCarousel($(this));
    });

    $('body').on('click', '.save-button', function(){
        updateWatchList($(this).parent().parent().children(".modal-header").children(".modal-title").text());
    })

    
    //Functions----------------------------------------------------

    //streaming availability api fetch function
    //add seach limit protection so we dont go over 50 per day
    //API Key: 95154b8a57msha4e5c1348b5f178p1d6f1ejsn62dcb59bc28f
    function getUserQuery(searchedText) {
        // If there are already cards here, get rid of them.
        var existingCardEls = $('.search-card-col');
        if (existingCardEls){
            $(existingCardEls).remove();
        };
        // Fetch the results!
        var uriEncodedText = encodeURI(searchedText);
        var searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false&query=${uriEncodedText}`;
        fetch(searchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // add cards for search results.
            console.log(data);
            var searchResults = data.results
            var cardArea = $("#search-result-cards");
            for (let i = 0; i < searchResults.length; i++) {
                const element = searchResults[i];

                var searchObj = {
                    title: element.title,
                    id: element.id,
                    genres: element.genre_ids,
                    media: element.media_type,
                    release: element.release_date,
                    description: element.overview,
                    popularity: element.vote_average,
                    poster: element.poster_path,
                    backdrop: element.backdrop_path
                }
                console.log(searchObj)
                onScreenObjects.push(searchObj);

                var newCardColumn = $('<div class="col s2 m2 l2 search-card-col"></div>')
                var newSearchCard = $(`<div class="card modal-trigger" id="${element.id}" data-target="description-modal">`)
                var newCardImage = $('<div class="search-poster">')
                var newCardImageSrc = $(`<img class="search-poster" src="https://image.tmdb.org/t/p/w500/${searchObj.poster}">`)
                cardArea.append(newCardColumn);
                newCardColumn.append(newSearchCard);
                newSearchCard.append(newCardImage);
                newSearchCard.attr("data-movie-id", element.id);
                //var _tempStyle = newCardImage.attr();
                newCardImageSrc.attr('style', `max-width: ${vw*20}px; max-height: ${(vw*20*1.33)}px; min-width: ${vw*20}px; min-height: ${(vw*20*1.33)}px`);
                newCardImage.append(newCardImageSrc);
                
            }
        });
    }

    // TMDB api fetch function
    function getTopTenTv() {
        var trendingTvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}`
        fetch(trendingTvUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
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
        // var youTubeApiUrl = `https://www.googleapis.com/youtube/v3/search?q=${searchKeyword}%previewpart=snippet&order=relevance&type=video&videoDefinition=high&key=${youTubeApiKey}`;
        
        // var test = await fetch(youTubeApiUrl)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (data) {
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
                id: element.id,
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
            var card = $(`<div class="carousel-item card modal-trigger" id="${cardObj.id}" data-target="description-modal">`);
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
                id: element.id,
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
            var card = $(`<div class="carousel-item card modal-trigger" id="${cardObj.id}" data-target="description-modal">`);
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
            $('#movie-carousel').carousel('prev');
        }
        if(element.hasClass('tv-next')){
            $('#tv-carousel').carousel('next');
        } else if(element.hasClass('tv-previous')){
            $('#tv-carousel').carousel('prev');
        }
    }

    //Launch modal for title information
    async function titleDetails(element) {
        console.log(onScreenObjects)
        var openedTitle = onScreenObjects.find(obj => obj.id == element);
        console.log(element)
        console.log(openedTitle);
        var genre = getGenre(openedTitle.genres).join(', ');

        //getting the trailer into modal using async functions.
        //can propably be written better but it works so were keeping it as is for now.
        async function getUrl(){
            returnedUrl = await getYoutubeTrailers(openedTitle.title).then(url => {
                return url;
            })
            return returnedUrl;
        }
        async function getProviders(){
            returnedProviders = await getStreamingService(openedTitle.id, openedTitle.media).then(prov => {
                return prov;
            })
            return returnedProviders;
        }
        var youTubeUrl = 'https://www.youtube.com/embed/' + await getUrl();
        var streamingServices = await getProviders();
        streamingMethod = streamingServices.splice(0,1);
        //fill modal contents
        $('.modal-title').text(openedTitle.title);
        $('.modal-info').text(openedTitle.release + ' ' + genre + ' ' + (Math.round(openedTitle.popularity * 10) + '%'));
        $('.modal-description').text(openedTitle.description);
        $('.modal-trailer').attr('src', `${youTubeUrl}`);
        $('.modal-services').text(streamingMethod + streamingServices.join(', '));

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
    var watchListItems = $('.watch-list-card')
    watchListItems.remove();
    $('.watch-list-title').text('My Watch List');
    if(watchList === null) {
        watchList = [];
    }
    //populate watch list with saved titles
    for (let i = 0; i < watchList.length; i++) {
        var element = watchList[i];
        var watchListCard = $('<div class="watch-list-card card modal-trigger" data-target="description-modal">');
        watchListCard.attr("style", `background-image: url(https://image.tmdb.org/t/p/w500/${element.backdrop})`);
        var watchListCardTitle = $('<div class="card-title left-align ">')
        watchListCardTitle.text(element.title);
        watchListCard.append(watchListCardTitle);
        $('.watch-list-main').append(watchListCard);
    }

    }
    //Create conditional logic to turn genre codes into appropriate strings
    //Return array of strings
    //
    function getGenre(array) {
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

    async function getStreamingService(element, type) {
        var id = element;
        var media = type;
        var providers = [];
        if(media === 'movie'){
            var streamRequest = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${tmdbApiKey}`
            var movieProvidersArr = [];

            await fetch(streamRequest)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if(data.results.US != undefined){
                        if(data.results.US.rent != undefined){
                            movieProvidersArr = data.results.US.rent;
                            for (let i = 0; i < movieProvidersArr.length; i++) {
                                const element = movieProvidersArr[i];
                                providers.push(element.provider_name);
                            }
                            providers.unshift('Rent: ')
                        } else if(data.results.US.flatrate != undefined) {
                            movieProvidersArr = data.results.US.flatrate;
                            for (let i = 0; i < movieProvidersArr.length; i++) {
                                const element = movieProvidersArr[i];
                                providers.push(element.provider_name);
                            }
                            providers.unshift('Flatrate: ')
                        } else if (data.results.US.buy != undefined){
                            movieProvidersArr = data.results.US.buy;
                            for (let i = 0; i < movieProvidersArr.length; i++) {
                                const element = movieProvidersArr[i];
                                providers.push(element.provider_name);
                            }
                            providers.unshift('Buy: ')
                        } else {
                            providers.push('No streaming services found. Sorry.');
                        }
                    } else {
                        providers.push('No streaming services found. Sorry.');
                    }
                });
        } else if(media === 'tv'){
            var streamRequest = `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${tmdbApiKey}`
            var tvProvidersArr = [];
            var providers = [];

            await fetch(streamRequest)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if(data.results.US != undefined){
                        tvProvidersArr = data.results.US.flatrate;
                        for (let i = 0; i < tvProvidersArr.length; i++) {
                            const element = tvProvidersArr[i];
                            providers.push(element.provider_name);
                        }
                        providers.unshift('Flatrate: ')
                    } else {
                        providers.push('No streaming services found. Sorry.');
                    }
                });
            }
        return providers;
    }

});



