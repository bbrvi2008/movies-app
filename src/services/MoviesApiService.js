/* eslint-disable camelcase */
import StorageValue from './StorageValue';

const API_KEY = process.env.REACT_APP_MOVIEDB_API_KEY;
const StorageValues = {
  session: 'movies-app:session',
  genres: 'movies-app:genres',
  rating: 'movies-app:rating'
}

export default class MoviesApiService {
  baseUrl = 'https://api.themoviedb.org/3';

  defaultParams = {
    api_key: API_KEY
  };

  constructor() {
    this.getStorableGuestSession = StorageValue.storable(
      this.getGuestSession.bind(this),
      StorageValues.session, 
      session => new Date(session.expires_at).setHours(1) > new Date().getTime()
    );

    this.getStorableGenres = StorageValue.storable(
      this.getGenres.bind(this),
      StorageValues.genres
    );

    this.getStorableRatingAllMovies = StorageValue.storable(
      this.getRatingAllMovies.bind(this),
      StorageValues.rating,
      () => false
    );
  }

  async fetchResource(url, inputParams = {}, options = {}) {
    const params = { ...this.defaultParams, ...inputParams};
    const queryParams = Object.entries(params).map(param => param.join('=')).join('&');

    const response = await fetch(`${this.baseUrl}${url}?${queryParams}`, options);
    if(!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }

    return response.json();
  }

  async fetchResourceWithSession(url, inputParams = {}, options) {
    const sessionId = await this.getSessionId();

    return this.fetchResource(url, {
      ...inputParams,
      guest_session_id: sessionId
    }, options);
  }

  getResource(url, inputParams) {
    return this.fetchResource(url, inputParams);
  }

  postResourceWithSession(url, data, inputParams) {
    return this.fetchResourceWithSession(url, inputParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
  }

  getPosterUrl(imagePath) {
    return imagePath && `https://image.tmdb.org/t/p/w300_and_h450_bestv2${imagePath}`;
  }

  async getMovies(query, page = 1) {
    const ratingAllMovies = await this.getStorableRatingAllMovies();

    return this.fetchResourceWithSession('/search/movie', {
      query,
      page
    }).then(json => {
      const { page: currentPage, total_pages: countPages, total_results: countItems, results } = json;

      return {
        currentPage,
        countPages,
        countItems,
        films: this.transformMovies(results, ratingAllMovies)
      };
    });
  }

  async getRatingAllMovies(currentPage = 1) {
    const { films, countPages } = await this.getRatedMovies(currentPage);

    const ratings = currentPage < countPages
      ? await this.getRatingAllMovies(currentPage + 1)
      : {};

    return films.reduce((dictionary, { id, rating }) => {
      return {
        ...dictionary,
        [id]: rating
      };
    }, ratings);
  }

  async getRatedMovies(page = 1) {
    const sessionId = await this.getSessionId();

    return this.getResource(`/guest_session/${sessionId}/rated/movies`, {
      page
    }).then(json => {
      const { page: currentPage, total_pages: countPages, total_results: countItems, results } = json;

      return {
        currentPage,
        countPages,
        countItems,
        films: this.transformRatedMovies(results)
      };
    });
  }

  rateMovies(filmId, rate) {
    return this.postResourceWithSession(`/movie/${filmId}/rating`, {
      value: rate
    });
  }

  getGenres() {
    return this.getResource('/genre/movie/list')
      .then(json => {
        return json.genres.reduce((dictionary, { id, name }) => {
          return {
            ...dictionary,
            [id]: name
          };
        }, {});
      });
  }

  getGuestSession() {
    return this.getResource('/authentication/guest_session/new');
  }

  async getSessionId() {
    const session = await this.getStorableGuestSession();
    
    return session.guest_session_id;
  }

  transformMovie({ id, original_title, release_date, genre_ids, overview, poster_path, vote_average }, ratingAllMovies = {}) {
    return {
      id,
      title: original_title,
      date: Date.parse(release_date) ? new Date(release_date) : null,
      genres: genre_ids,
      description: overview,
      poster: this.getPosterUrl(poster_path),
      rate: vote_average,
      rating: ratingAllMovies[id]
    }
  }

  transformMovies(arr, ratingAllMovies) {
    return arr.map(item => this.transformMovie(item, ratingAllMovies));
  }

  transformRatedMovies(arr) {
    return arr.map(item => {
      const movie = this.transformMovie(item);
      const { rating } = item;

      return {
        ...movie,
        rating
      }
    });
  }

  transformGenreIds(genreIds, genres) {
    return genreIds.map(genreId => genres[genreId]);
  } 
}