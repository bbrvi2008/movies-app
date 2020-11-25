/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const API_KEY = process.env.REACT_APP_MOVIEDB_API_KEY;

export default class MoviesApiService {
  baseUrl = 'https://api.themoviedb.org/3';

  defaultParams = {
    api_key: API_KEY
  };
  
  async getResource(url, inputParams) {
    const params = { ...this.defaultParams, ...inputParams};
    const queryParams = Object.entries(params).map(param => param.join('=')).join('&');

    const response = await fetch(`${this.baseUrl}${url}?${queryParams}`);
    if(!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }

    return response.json();
  }

  getPosterUrl(imagePath) {
    return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${imagePath}`;
  }

  getMovies(query, page = 1) {
    return this.getResource('/search/movie', {
      query,
      page
    }).then(json => {
      const { page: currentPage, total_pages: countPages, total_results: countItems, results } = json;

      return {
        currentPage,
        countPages,
        countItems,
        films: this.transformMovies(results)
      };
    });
  }

  transformMovies(arr) {
    return arr.map(({ id, original_title, release_date, genre_ids, overview, poster_path }) => {
      return {
        id,
        title: original_title,
        date: Date.parse(release_date) ? new Date(release_date) : null,
        genres: ['Drama', 'Action'],
        description: overview,
        poster: this.getPosterUrl(poster_path)
      }
    });
  }
}