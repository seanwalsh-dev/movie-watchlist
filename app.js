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

  -(1): add an if statement so that way if there are no results it does one thing and if there are results it does another.

  -Why doesn't text for false movie text work anymore?

  

  -watchlist click on and off.


*/

const movieSearch = document.getElementById('movie-search')
const searchBtn = document.getElementById('search-btn')
const form = document.getElementById('movie-search-form')
const htmlContainer = document.getElementById('search-results-container')

const apiKey = 'eff62d0a'

let moviesData

let watchlistArr =[]

let html

form.addEventListener('submit', handleSubmit)

// Call API by Search Result

async function handleSubmit(e){

  e.preventDefault()

  const searchInput = movieSearch.value

  const res = await fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=${apiKey}`)
  
  const data = await res.json()

  

    console.log('data: ', data)

    if(data.Response === 'True'){
      getMoviesById(data.Search)
    }
    else if(data.Response === 'False'){
      console.log('***  No movies found  ***')
      renderSearch()
    }

    

    movieSearch.value = ''
}

// Call API to get the individual movies by their IMDB ID to get additional useful information

async function getMoviesById(movies){
  
  const moviePromises = movies.map(movie => 
    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
      .then(res => res.json())
  )

  const moviesByIdArray = await Promise.all(moviePromises)
  console.log('Movies By Id Array:', moviesByIdArray)
  // return moviesByIdArray
  moviesData = moviesByIdArray
  renderSearch(moviesByIdArray)
}

/*
********************
WORKING HERE
********************



TODO:

  - create a button that toggles
    - https://stackoverflow.com/questions/76837048/creating-the-simplest-html-toggle-button

  -have it look the same as it does now

  -push object to a watchlistArr

CHANGES:

  -app.js
      - changed watchlist span to btn.
      -changed dataset to id.
  - style.css
      - updated watchlist-btn style

*/



htmlContainer.addEventListener('click', watchlistClick)

function watchlistClick(e, data){
  moviesData = data
  console.log('md inside watchlistClick: ', moviesData)

  console.log(e.target.id)

  if (!e.target.matches(".watchlist-btn")) return;

  e.target.classList.toggle("active");

  // const targetObj = html.filter((html) => html.includes(e.target.id))

  if (e.target.classList.contains("active")) {
    e.target.textContent = "- Remove";
    
    watchlistArr.push(targetObj)
    console.log(targetObj)
    console.log('watchlistArr: ', watchlistArr)
  } else {
    e.target.textContent = "+ Watchlist";
//  PICK UP HERE: Why does updatedArr have no objects in it 
    const updatedArr = watchlistArr.filter((obj) => obj.includes(e.target.id))
    console.log('updatedArr: ', updatedArr)
    watchlistArr = updatedArr
    
  }
}


function renderSearch(movies){

  // let html

  if(movies){
    console.log('*** good movie search ***')
    html = movies.map(movie => 
      `
        <div class="movie-container">
          <div class="movie-poster-container test">
            <img src="${movie.Poster}" class="movie-poster" alt="${movie.Title} movie poster">
          </div>
          <div class="movie-info-container test">
            <div class="movie-title-container test">
              <h2 class="movie-title">${movie.Title}</h2>
              <p class="movie-stats">⭐ ${movie.imdbRating}</p>
            </div>
            <div class="movie-info-container test">
              <p class="movie-stats space-between">
                <span>${movie.Runtime}</span>
                <button
                  type="button"
                  id="${movie.imdbID}"
                  class="watchlist-btn"
                  aria-pressed="false"
                >
                  + Watchlist
                </button>
              </p>
              <p class="movie-stats">
                <span>${movie.Genre}</span>
              </p>
            </div>
            <div class="movie-description-container">
              <p class="movie-description">${movie.Plot}</p>
              
            </div>
          </div>
        </div>
      `
    ).join('')

    
  }
  else if(!movies){

    html = `
      <p class="no-search-results">
        Unable to find what you’re looking for.
        <span>Please try another search.</span>
      </p>`

  }
  
  htmlContainer.innerHTML = html

}
