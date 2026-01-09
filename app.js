/*

API
https://www.omdbapi.com/

API Key
  Here is your key: eff62d0a

  Please append it to all of your API requests,

  Example
    http://www.omdbapi.com/?i=tt3896198&apikey=eff62d0a

    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => console.log(data))


TODO
  +convert to async

  -(1): add an if statement so that way if there are no results it does one thing and if there are results it does another.

  +(2): change the for of loop to .map() so the results are in an array

  -Render results on the page


*/

const movieSearch = document.getElementById('movie-search')
const searchBtn = document.getElementById('search-btn')
const form = document.getElementById('movie-search-form')

const apiKey = 'eff62d0a'

form.addEventListener('submit', handleSubmit)

// getApiBySearch()

// Call API by Search Result

async function handleSubmit(e){

  e.preventDefault()

  const searchInput = movieSearch.value

  const res = await fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=${apiKey}`)
  
  const data = await res.json()

    // console.log(data)

    // TODO (1)

    getMoviesById(data.Search)

    movieSearch.value = ''
}

// Call API to get the individual movies by their IMDB ID to get additional useful information

async function getMoviesById(movies){

  // console.log('movies: ', movies)
  
  const moviePromises = movies.map(movie => 
    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
      .then(res => res.json())
  
  ) //  Will I need a .join()?

  const moviesByIdArray = await Promise.all(moviePromises)
  console.log('Movies By Id Array:', moviesByIdArray)
  return moviesByIdArray
}
