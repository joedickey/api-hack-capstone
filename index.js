const searchURL = "https://api.themoviedb.org/3/"
const imagePathUrl = "https://image.tmdb.org/t/p/original"
const apiKeyQuery = "?api_key=df3341688556ba5dadfc14be29cc9299"

/* other links 
Get ID for person: https://developers.themoviedb.org/3/search/search-people
Movies by person: https://developers.themoviedb.org/3/people/get-person-movie-credits
Movie further details: https://api.themoviedb.org/3/movie/497?api_key=df3341688556ba5dadfc14be29cc9299&language=en-US
Movie MPAA rating: https://api.themoviedb.org/3/movie/13/release_dates?api_key=df3341688556ba5dadfc14be29cc9299
*/

// HTML TEMPLATES 
function actorProfile(image, name){
   return $('.actor-profile').html(`<img id="profile-pic" src="${image}" alt="Actor Picture">
    <h3 id="display-name">${name}</h3>`)
}

function getGenreTags(genres){
    const genreNames = [];
    for(i = 0; i < genres.length; i++){
        genreNames.push(genres[i].name)
    }
    return genreNames.join(", ");
}

function displayMovieDetails(movieList){
    // display movie details and appends to UL in HTML
    
    for(i = 0; i < movieList.length; i++){
        //let genreTags = getGenreTags(movieList[i].genres);

        $('#results').append(
            `<li class="movie-display">
                 <span id="broken-image-format"><img src="${imagePathUrl + movieList[i].poster_path}" alt="Movie Poster" class="poster"></span>
                <div class="text-elements">
                     <div class="info-row">
                        <h3 class="title">${movieList[i].title}</h3>
                        <p class="release-year">${"(" + movieList[i].release_date.substring(0, 4) + ")"}</p>
                     </div>
                    <div class="info-row">
                        <p class="rating">${(movieList[i].vote_average * 10) + "%"}</p>
                        <p class="genre-tags">${movieList[i].genres[0].name}</p>
                    </div>  
                    <div class="info-row">
                        <p class="overview">${movieList[i].overview}</p>
                    </div>  
                </div>
            </li>`)
    }

}


// MAIN FUNCTIONS 

// function rankByRating(movieDetails){
//     return movieDetails.sort(function(a,b) { return a.vote_average - b.vote_average });
// }

/*function getReleaseDetails(idArray) {
    // cycle through array of movie IDs and return array of MPAA Ratings per ID
    const ratingsArray = [];
    for(i = 0; i < idArray.length; i++){
        let url = `https://api.themoviedb.org/3/movie/${idArray[i]}/release_dates?api_key=df3341688556ba5dadfc14be29cc9299`
        fetch(url)
            .then(response => response.json())
            .then(function(responseJson){
                for(i = 0; i < responseJson.results.length; i++){
                    if(responseJson.results[i].iso_3166_1 === "US" && responseJson.results[i].release_dates.length === 1){
                        ratingsArray.push(responseJson.results[i].release_dates[0].certification);
                    } else 
                    if(responseJson.results[i].iso_3166_1 === "US" && responseJson.results[i].release_dates[1].certification !== "") {
                        ratingsArray.push(responseJson.results[i].release_dates[1].certification);
                    } else
                    if(responseJson.results[i].iso_3166_1 === "US" && responseJson.results[i].release_dates[2].certification !== ""){
                        ratingsArray.push(responseJson.results[i].release_dates[2].certification)
                    }
                        
                }   
            })
            .catch(err => $('#error-message').text("Oops, something went wrong on our end. Please check back later."))
    }
    console.log(idArray, ratingsArray)
    return ratingsArray;
}*/

function rankMoviesByVoteAvg(movieDetails){ //maybe add mpaaRatings
    // ranks movies in descending order from highest voter average
    const moviesRankedByVote = movieDetails.sort((a, b) => b.vote_average - a.vote_average);   
    displayMovieDetails(moviesRankedByVote);
}

function getMovieDetails(idArray){
    // cycle through array of movie IDs and send details to displayMovieDetails function
    //const mpaaRatings = getReleaseDetails(idArray);
    const movieDetailsArray = [];
    for(i = 0; i < idArray.length; i++){
        let url = `https://api.themoviedb.org/3/movie/${idArray[i]}?api_key=df3341688556ba5dadfc14be29cc9299`;
       
       movieDetailsArray.push(
           fetch(url)
            .then(response => response.json())
            .then(function(responseJson){
                if(responseJson.poster_path !== null && responseJson.release_date.substring(0, 4) <= new Date().getFullYear() && responseJson.release_date.substring(0, 4) !== "" ){
                    return responseJson;
                } else {
                    return delete responseJson;
                }
            })
            .catch(err => $('#error-message').text("Oops, something went wrong on our end. Please check back later."))
       );
    } 
    Promise.all(movieDetailsArray)
        .then(res => rankMoviesByVoteAvg(res));
}

function getMovieListIds(list){
    // create and array of IDs for filmography of the actor
    const movieIdArray = [];
    for (i = 0; i < list.cast.length; i++){
        movieIdArray.push(list.cast[i].id);
    }
    getMovieDetails(movieIdArray);
}

function getMoviesList(id){
    // get filmography by actor ID
    const endpointMovieCredits = `person/${id}/movie_credits`;
    const url = searchURL + endpointMovieCredits + apiKeyQuery;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => getMovieListIds(responseJson))
        .catch(err => $('#error-message').text("Oops, something went wrong on our end. Please check back later."))
}

function getPersonDetails(responseJson, name){
    //get ID number for person and display image and name
    const displayName = responseJson.results[0].name;
    const profilePicPath = responseJson.results[0].profile_path;
    const nameId = responseJson.results[0].id;
    const profilePicUrl = imagePathUrl + profilePicPath;
    const formattedDataName = displayName.replaceAll(" ","").replaceAll("é","e").replaceAll("-", "").replaceAll(".", "").toLowerCase(); //****revisit */
    const formattedInputName = name.replaceAll(" ","").replaceAll("é","e").replaceAll("-", "").replaceAll(".", "").toLowerCase();
    if(formattedDataName == formattedInputName){
        actorProfile(profilePicUrl, displayName);
        getMoviesList(nameId);
    }
    else {
        return $('#error-message').text("We could not find an actor with that name.")
    }
}

function getPersonByName(name){
    //locate person in API database by name
    const endpointSearchPeople = "search/person";
    const encodedName = `${encodeURIComponent(name)}`;
    const url = searchURL + endpointSearchPeople + apiKeyQuery + "&query=" + encodedName;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.results.length > 0){
                return getPersonDetails(responseJson, name);
            }
            else {
                return $('#error-message').text("We could not find an actor with that name.")
            }
        }
            )
        .catch(err => $('#error-message').text("Oops, something went wrong on our end. Please check back later."));
}

// EVENT HANDLERS 

function watchForm(){
    //take in actor name from search input
    $('#search-form').submit(event => {
        event.preventDefault();
        const name = $('#search-bar').val();
        getPersonByName(name);
        $('#search-bar').val('');
        $('#error-message').text('');
        $('#results').empty();
    })
}

$(function(){
    watchForm();
    //getPersonByName();
    //getPersonDetails();
});