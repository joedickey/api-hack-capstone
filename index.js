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

// MAIN FUNCTIONS 

function getPersonDetails(responseJson, name){
    //get ID number for person and display image and name
    const displayName = responseJson.results[0].name;
    const profilePicPath = responseJson.results[0].profile_path;
    const nameId = responseJson.results[0].id;
    const profilePicUrl = imagePathUrl + profilePicPath;
    const formattedDataName = displayName.replaceAll(" ","").replaceAll("é","e").replaceAll("-", "").toLowerCase();
    const formattedInputName = name.replaceAll(" ","").replaceAll("é","e").replaceAll("-", "").toLowerCase();
    if(formattedDataName == formattedInputName){
        actorProfile(profilePicUrl, displayName);
        console.log(nameId); // run this id to getMoviesList function
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
    })
}

$(function(){
    watchForm();
    //getPersonByName();
    //getPersonDetails();
});