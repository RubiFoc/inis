let numberOfFilms;

do {
    numberOfFilms = prompt('Сколько фильмов вы уже посмотрели?', '');
    if (numberOfFilms === null || numberOfFilms.trim() === '' || isNaN(numberOfFilms)) {
        alert('Введите корректное число!');
    }
} while (numberOfFilms === null || numberOfFilms.trim() === '' || isNaN(numberOfFilms));

const personalMovieDB = {
    count: numberOfFilms,
    movies: {}
};

for (let i = 0; i < numberOfFilms; i++) {
    let lastMovie, movieRating;

    do {
        lastMovie = prompt('Один из последних просмотренных фильмов?', '');
        if (lastMovie === null || lastMovie.trim() === '' || lastMovie.length > 50) {
            alert('Введите корректное название фильма (не более 50 символов)!');
        }
    } while (lastMovie === null || lastMovie.trim() === '' || lastMovie.length > 50);

    do {
        movieRating = prompt('На сколько оцените его? (от 0 до 10)', '');
        if (movieRating === null || movieRating.trim() === '' || isNaN(movieRating) || movieRating < 0 || movieRating > 10) {
            alert('Введите корректную оценку (от 0 до 10)!');
        }
    } while (movieRating === null || movieRating.trim() === '' || isNaN(movieRating) || movieRating < 0 || movieRating > 10);

    personalMovieDB.movies[lastMovie] = movieRating;
}

console.log(personalMovieDB);

function displayMovies() {
    const movieTable = document.getElementById('movieTable');
    movieTable.innerHTML = '';
    const table = document.createElement('table');
    table.border = '1';

    const headerRow = document.createElement('tr');
    const th1 = document.createElement('th');
    th1.textContent = 'Фильм';
    const th2 = document.createElement('th');
    th2.textContent = 'Оценка';

    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    table.appendChild(headerRow);

    for (let movie in personalMovieDB.movies) {
        if (Object.prototype.hasOwnProperty.call(personalMovieDB.movies, movie)) {
            const row = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = movie;
            const td2 = document.createElement('td');
            td2.textContent = personalMovieDB.movies[movie];

            row.appendChild(td1);
            row.appendChild(td2);
            table.appendChild(row);
        }
    }

    movieTable.appendChild(table);
}

displayMovies();
