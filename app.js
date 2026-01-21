/*

API
https://www.omdbapi.com/

TODO:
  - begin watchlist.html
      -edit app.js to work on both pages

CHANGES:
  ""

*/

const movieSearch = document.getElementById('movie-search')
const searchBtn = document.getElementById('search-btn')
const form = document.getElementById('movie-search-form')
const htmlContainer = document.getElementById('search-results-container')
const watchlistContainer = document.getElementById('watchlist-container')

const apiKey = 'eff62d0a'

let moviesData

let watchlistArr = getFromLocalStorage() || []

console.log('watchlist: ', watchlistArr)

let html

if(form) form.addEventListener('submit', handleSubmit)

// Call API by Search Result

async function handleSubmit(e){

  e.preventDefault()

  const searchInput = movieSearch.value

  const res = await fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=${apiKey}`)
  
  const data = await res.json()


    if(data.Response === 'True'){
      getMoviesById(data.Search)
    }
    else if(data.Response === 'False'){
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
  moviesData = moviesByIdArray
  renderSearch(moviesData)
}

function iterateMovies(movies) {
  return movies.map(movie => {

      const isOnWatchlist = watchlistArr.some(obj => obj.imdbID === movie.imdbID) //  Boolean: returns true if there is an obj in watchlistArr with the same imdbId as the currnet movie in moviesData.  Returns false if there is not
                                                                                  //  returns the html code to html
      return `                                                                    
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
                  class="watchlist-btn ${(isOnWatchlist) ? 'active' : ''}"
                  aria-pressed="${isOnWatchlist}"
                >
                  ${(isOnWatchlist) ? '- Remove' : '+ Watchlist'}
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
      
    }).join('')  
}

function renderSearch(movies){  //  renders search results
  if(movies){ //  if the search was successful and has results
                                                                   //  indicates how the itmes of html will be joined
    html = iterateMovies(moviesData)
    

    
  }
  else if(!movies){                                                             //  if the search was not successful and does not have results
                                                                                //  html code for unsuccessful movie searches 
    html = `
      <p class="no-search-results">
        Unable to find what you’re looking for.
        <span>Please try another search.</span>
      </p>`

  }
  
  htmlContainer.innerHTML = html                                                //  htmlContainer will display html
}

  /*
********************************************************************************
                                    WORKING HERE
********************************************************************************
*/

function renderWatchlist(movies) {
  
  let html

  if(watchlistContainer){
    if(watchlistArr.length === 0){
      html = `
        <p class="no-search-results">
          There are no movies
          <span>In your watchlist</span>
        </p>`
    }else{
      html = iterateMovies(watchlistArr)
  }
  watchlistContainer.innerHTML = html
  }
  
}

renderWatchlist(watchlistArr)








// if(htmlContainer) htmlContainer.addEventListener('click', htmlClick)





// if(watchlistContainer) watchlistContainer.addEventListener('click', watchlistClick)

// function watchlistClick(e){
//   if (!e.target.matches(".watchlist-btn")) return; // same                        // if not a watchlist btn, ignore
//   console.log('moviesData: ', moviesData)
  
//   if (watchlistArr.find(obj => obj.imdbID === e.target.id)){ //different         //  If there is a movie in watchlistArr that has the same imdbID
//     // remove from watchlist
//     const newArr = watchlistArr.filter(obj => obj.imdbID !== e.target.id) //  create a new arr without the obj that has the same (imdb)id as the button clicked
//     watchlistArr = newArr                                                 //  watchlist now equals the new arr with the removed obj
//   }
//   // renderSearch(moviesData)
//   renderWatchlist(watchlistArr)
//   saveInLocalStorage()

// }

// function saveInLocalStorage() {
//   localStorage.setItem('watchlist', JSON.stringify(watchlistArr))
// }

// function getFromLocalStorage() {
//   return JSON.parse(localStorage.getItem('watchlist'))
// }



if(htmlContainer) htmlContainer.addEventListener('click', bothClick)
if(watchlistContainer) watchlistContainer.addEventListener('click', bothClick)

function bothClick(e){
  if (!e.target.matches(".watchlist-btn")) return;                        // if not a watchlist btn, ignore
  const section = e.target.closest("section")
  console.log('e.target: ', section.id)

    if (section.id === 'section-results-container'){
      console.log('hell')
    }
  let targetObj
  if(htmlContainer) targetObj = moviesData.find(obj => obj.imdbID === e.target.id) // different    //  targetObj is the obj in moviesData with the same (imdb)id as the button clicked

  if (watchlistArr.find(obj => obj.imdbID === 
  (section.id === 'search-results-container') ? targetObj.imdbID : e.target.id )){// different         //  If there is a movie in watchlistArr that has the same imdbID
    // remove from watchlist
    const newArr = watchlistArr.filter(obj => obj.imdbID !== e.target.id) //  create a new arr without the obj that has the same (imdb)id as the button clicked
    watchlistArr = newArr                                                 //  watchlist now equals the new arr with the removed obj
  }else{                                                                  //  If there is not a movie in watchlistArr that has the same imdbID
    // add to watchlist
    watchlistArr.push(targetObj)                                          //  add the target obj to watchlistArr
    
  }
  if(htmlContainer) renderSearch(moviesData)
  renderWatchlist(watchlistArr)
  saveInLocalStorage()

}









function saveInLocalStorage() {
  localStorage.setItem('watchlist', JSON.stringify(watchlistArr))
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem('watchlist'))
}