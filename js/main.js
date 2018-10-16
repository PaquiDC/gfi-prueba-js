/**
 * @autor: Francisca Díaz Contreras
 * @since: 2018-10-16
 */

 /** The api key */
var apiKey = 'f12ba140';
var dataUrl = 'http://www.omdbapi.com/?apikey=' + apiKey;
var posterUrl = 'http://img.omdbapi.com/?apikey=' + apiKey;
var userLogin;

/**
 * Find film by id
 * 
 * @param {string} id 
 */
function findFilmById(id) {

    let url = dataUrl + '&i=' + id;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();

    return JSON.parse(xhttp.responseText);

}

/**
 * Find films by title and/or year
 * 
 * @param {string} title 
 * @param {string} year 
 */
function findFilmsByTitleAndYear(title, year) {

    let url = dataUrl;

    if (title) {
        url += '&s=' + title;
    }

    if (year) {
        url += '&y=' + year;
    }

    url += '&page=1';
    url += '&type=movie';

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    return xhttp.responseText;

}

/**
 * Get poster by id
 * 
 * @param {string} id 
 */
function getPosterById(id) {

    let url = posterUrl + '&i=' + id;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    return xhttp.responseText;
}

/**
 * Event button seach click
 */
function find() {

    let title = document.getElementById('title').value;
    let year = document.getElementById('year').value;

    let algo = findFilmsByTitleAndYear(title, year);

    loadFilms(JSON.parse(algo).Search);
}

/**
 * Films view loader
 * 
 * @param {Array} filmsData 
 */
function loadFilms(filmsData) {

    let mark = document.getElementById('searchBody');
    mark.innerHTML = '';

    if (!filmsData) {
        mark.innerHTML = '<p class="text-center">No data</p>';
        return;
    }

    let data = '';
    let i = 0;
    for (; i < filmsData.length; i++) {
        data += buildFilmFrame(filmsData[i]);
    }

    mark.innerHTML = data;
}

/**
 * Film view loader
 * @param {object} film 
 */
function buildFilmFrame(film) {

    return `
    <div class="card">
        <img class="card-img-top" src="${film.Poster}" />
        <div class="card-body">
            <h5 class="card-title">${film.Title} (${film.Year})</h5>
        </div>
        <div class="card-footer">
            <a href="#detailView" class="card-link" onclick="loadDetail('${film.imdbID}')">details...</a>
        </div>

    </div>
    `;
}

/**
 * Detail view loader
 * 
 * @param {string} filmId 
 */
function loadDetail(filmId) {

    document.getElementById('searchView').style.display = 'none';
    document.getElementById('detailView').style.display = 'block';
    let detailBody = document.getElementById('detailBody');

    let film = findFilmById(filmId);  
    
    detailBody.innerHTML = `

        <div class="media">
            <img class="mr-3 img-thumbnail" src="${film.Poster}" alt="Generic placeholder image">
            <div class="media-body">
            <div><strong>Title:</strong> ${film.Title}</div>
            <div><strong>Year:</strong> ${film.Year}</div>
            <div><strong>Rated:</strong> ${film.Rated}</div>
            <div><strong>Released:</strong> ${film.Released}</div>
            <div><strong>Runtime:</strong> ${film.Runtime}</div>
            <div><strong>Genre:</strong> ${film.Genre}</div>
            <div><strong>Director:</strong> ${film.Director}</div>
            <div><strong>Writer:</strong> ${film.Writer}</div>
            <div><strong>Actors:</strong> ${film.Actors}</div>
            <div><strong>Plot:</strong> ${film.Plot}</div>
            <hr>
            <button class="btn btn-primary btn-block" onclick="addFavorite('${film.Title}', '${film.imdbID}')">Add favorite</button>
            </div>
        </div>
    `;
}

/**
 * Return button loader
 */
function backToSearch() {
    document.getElementById('searchView').style.display = 'block';
    document.getElementById('detailView').style.display = 'none';
}

/**
 * Favorite load event
 */
function loadFavorite() {

    let favoriteBody = document.getElementById('favoriteBody');
    let favorites = JSON.parse(localStorage.getItem(userLogin)) || [];

    let data = '<ul>';
    let i = 0;
    for (; i < favorites.length; i++) {

        data += `<li><a href="#detailView" onclick="loadDetail('${favorites[i].id}')">${favorites[i].title}</a></li>`;
    }

    data += '</ul>';

    favoriteBody.innerHTML = data;
}

/**
 * Save favorite in localstorage
 * 
 * @param {object} favorites 
 */
function saveFavorites(favorites) {

    localStorage.setItem(userLogin, JSON.stringify(favorites));
}

/**
 * Add favorite
 * 
 * @param {string} title 
 * @param {string} id 
 */
function addFavorite(title, id) {

    backToSearch();
    let favData = JSON.parse(localStorage.getItem(userLogin)) || [];

    favData.push({ title: title, id: id});

    saveFavorites(favData);
    loadFavorite();
}

/**
 * Login event
 */
function login() {

    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;

    if ( user !== 'admin' && pass !== 'admin' ) {
        alert('Usuario o contraseña incorrectos');
        return;
    } 

    userLogin = user;
    loadFavorite(userLogin);
    sessionStorage.setItem('user', userLogin);

    document.getElementById('loginView').style.display = 'none';
    document.getElementById('favoriteView').style.display = 'block';
    document.getElementById('searchView').style.display = 'block';
}

/**
 * Start event
 */
function start() {

    userLogin = sessionStorage.getItem('user');

    if (userLogin !== null && userLogin !== undefined) {

        loadFavorite(userLogin);

        document.getElementById('loginView').style.display = 'none';
        document.getElementById('favoriteView').style.display = 'block';
        document.getElementById('searchView').style.display = 'block';
    }
}

window.onload = function () {

    start();
}