const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#Search-form')
const searchInput = document.querySelector('#Seach-input')
//渲染卡片
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(e => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + e.image}"
              class="card-img-top" alt="Movie Post">
            <div class="card-body">
            <h5 class="card-title">${e.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn btn-primary btn-show-movie mr-2 mt-1" data-toggle="modal"
              data-target="#movie-modal " data-id="${e.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite mt-1" data-id="${e.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
//串接API給Modal
function showMovieModal(id) {
  const modalTital = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalData = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((res) => {
    const data = res.data.results
    modalTital.innerText = data.title
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster"
      class="image-fuid">`
    modalData.innerText = 'Release Date：' + data.release_date
    modalDescription.innerText = data.description
  })
}

//移除收藏
function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movies === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

//點擊按鈕
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})
renderMovieList(movies)