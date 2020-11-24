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

    return response.json();
  }

  getPosterUrl(imagePath) {
    return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${imagePath}`;
  }

  getMovies(query) {
    return this.getResource('/search/movie', {
      query
    }).then(json => {

      // eslint-disable-next-line camelcase
      return json.results.map(({ id, original_title, release_date, genre_ids, overview, poster_path }) => {
        return {
          id,
          title: original_title,
          date: new Date(release_date),
          genres: ['Drama', 'Action'],
          description: overview,
          poster: this.getPosterUrl(poster_path)
        }
      })
    });
  }
}