/*

API
https://www.omdbapi.com/

API Key
  Here is your key: eff62d0a

  Please append it to all of your API requests,

  Example
    http://www.omdbapi.com/?i=tt3896198&apikey=eff62d0a


TODO
  +Sign up for API key
  -update git
  -create new branch before moving forward.
  +make a variable for the API Key


*/

const apiKey = 'eff62d0a'

fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}`)
  .then(res => res.json())
  .then(data => console.log(data))

// Call API by Search Result

// TODO: convert to async

fetch(`https://www.omdbapi.com/?s=the-housemaid&type=movie&apikey=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)

    // TODO: add an if statement so that way if there are no results it does one thing and if there are results it does another.

    getMoviesByImdbId(data.Search)
  })

// Call API to get the individual movies by thei IMDB ID to get additional useful information

function getMoviesByImdbId(movies){

  console.log('movies: ', movies)

  // TODO: chage the for of loop to .map() so the results are in an array

  for (let movie of movies){
    console.log('movie: ', movie.imdbID)

    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        console.log('data: ', data)
        // TODO: Render results on the page
      })
  }

}