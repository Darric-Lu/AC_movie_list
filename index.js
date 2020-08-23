const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
let mode = "cardMode"
let cutPage = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#Search-form')
const searchInput = document.querySelector('#Seach-input')
const paginator = document.querySelector('#paginator')
const modeBtn = document.querySelector('#mode-btn')



// 渲染卡片頁面 card
function renderMovieCard(data) {
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
            <button class="btn btn-info btn-add-favorite mt-1" data-id="${e.id}">+</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

// 渲染清單頁面 list
function rederMovieList(data) {
  let rawHTML = ''
  data.forEach(e => {
    rawHTML += `
    <div class="col-12 border-bottom "> 
      <div class="m-3 d-flex justify-content-between">
        <div class="col-9 mt-2 ">
            <h3>${e.title}</h3>
        </div>
        <div class="col-3">
          <button class="btn btn btn-primary btn-show-movie mr-2 mt-1" data-toggle="modal" data-target="#movie-modal " data-id="${e.id}">More</button>
          <button class="btn btn-info btn-add-favorite mt-1" data-id="${e.id}">+</button>
        </div>
      </div>
    </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

// 渲染分頁器
function renderPagintor(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link"data-page="${page}" href="#">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 獲取分頁12筆資料
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 串接API給Modal渲染
function showMovieModal(id) {
  const modalTital = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalData = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(res => {
    const data = res.data.results
    modalTital.innerText = data.title
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster"
      class="image-fuid">`
    modalData.innerText = 'Release Date：' + data.release_date
    modalDescription.innerText = data.description
    console.log(id)
  })
}

// 加入Favorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  alert('完成收藏！')
}

// 設立監聽器，點擊 Modal / Favorite 按鈕
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 設立監聽器，點擊Pagintor按鈕 
paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  cutPage = Number(event.target.dataset.page)
  if (mode === 'cardMode') {
    renderMovieCard(getMoviesByPage(page))
  } else if (mode === 'listMode') {
    rederMovieList(getMoviesByPage(page))
  }
})


//設立監聽器，Search
searchForm.addEventListener('submit', function onSearchClicked(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPagintor(filteredMovies.length)
  renderMovieCard(getMoviesByPage(1))
})

// 設立mode監聽器，點擊list/card按鈕
modeBtn.addEventListener('click', function displayDataList(event) {
  if (event.target.matches('.fa-bars')) {
    console.log('bar')
    mode = "listMode"
    console.log(mode)
    rederMovieList(getMoviesByPage(cutPage))
  } else if (event.target.matches('.fa-th')) {
    console.log('card')
    mode = "cardMode"
    console.log(mode)
    renderMovieCard(getMoviesByPage(cutPage))
  }
})

//串接API
axios.get(INDEX_URL).then(res => {
  movies.push(...res.data.results)
  renderPagintor(movies.length)
  renderMovieCard(getMoviesByPage(1))
})


// const body = document.querySelector('body')
// body.addEventListener('click', tar => {
//   console.log(tar.target)
// })