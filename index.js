const searchURL = "https://developers.themoviedb.org/3/"
const imagePathUrl = "https://image.tmdb.org/t/p/original"
const apiKey = "df3341688556ba5dadfc14be29cc9299"

/* other links 
Get ID for person: https://developers.themoviedb.org/3/search/search-people
Movies by person: https://developers.themoviedb.org/3/people/get-person-movie-credits
Movie further details: https://api.themoviedb.org/3/movie/497?api_key=df3341688556ba5dadfc14be29cc9299&language=en-US
Movie MPAA rating: https://api.themoviedb.org/3/movie/13/release_dates?api_key=df3341688556ba5dadfc14be29cc9299
*/

// HTML TEMPLATES 


// MAIN FUNCTIONS 

function getPersonDetails(){
    //get ID number for person and display image and name
}

function getPersonByName(name){
    //locate person in API database by name
    console.log(name);

    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw Error(response.statusText);
        })
        .then(responseJson => getPersonDetails(responseJson))
        .catch(err => {
            $('#error-message').text("I'm sorry we did not find that actor.")
        })
}

// EVENT HANDLERS 

function watchForm(){
    //take in actor name from search input
    $('#search-form').submit(event => {
        event.preventDefault();
        const name = $('#search-bar').val();
        getPersonByName(name);
        $('#search-bar').val('');
    })
}

$(watchForm)
