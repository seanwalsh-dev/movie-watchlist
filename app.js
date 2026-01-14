/*

API
https://www.omdbapi.com/

TODO:

BUG:
  - doesn't stay (- Remove) when you switch searches

CHANGES:

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
  renderSearch(moviesByIdArray)
}

/*
********************************************************************************
                                    WORKING HERE
********************************************************************************
*/



htmlContainer.addEventListener('click', watchlistClick)

function watchlistClick(e){

// Testing console.logs
  // console.log('md inside watchlistClick: ', moviesData)
  // console.log('e.target.id: ', e.target.id)


  if (!e.target.matches(".watchlist-btn")) return;  // if not a watchlist btn, ignore

  e.target.classList.toggle("active");  // toggle on or off the active class

  if (e.target.classList.contains("active")) {  // If classlist has active
    e.target.textContent = "- Remove";  // text = -Remove

    const targetObj = moviesData.find(obj => obj.imdbID === e.target.id)

    if (targetObj){ //  to protect against targetObj being undefined and pushing undefined to watchlistArr
      watchlistArr.push(targetObj)
    }
  

  

  console.log('targetObj: ', targetObj)
  console.log('watchlistArr: ', watchlistArr)

  } else {
    e.target.textContent = "+ Watchlist";

    const newArr = watchlistArr.filter(obj => obj.imdbID !== e.target.id)

    console.log('newArr: ', newArr)

    watchlistArr = newArr

    console.log('watchlistArr: ', watchlistArr)
    
  }

  // TODO: add watchlistArr to localStorage
}


function renderSearch(movies){

  // let html

  if(movies){
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
