import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Alert, Pagination } from 'antd';

import SearchForm from 'components/SearchForm';
import FilmList from 'components/FilmList';
import Spinner from 'components/Spinner';

import MoviesApiService from 'services/MoviesApiService';

class SearchPage extends Component {
  static defaultProps = {
    onChangeRatedList: () => null
  };

  static propTypes = {
    onChangeRatedList: PropTypes.func
  };

  moviesApiService = new MoviesApiService();

  state = {
    searchText: 'return',
    currentPage: 1,
    countItems: null,
    films: [],
    loading: false,
    hasError: false
  };

  componentDidMount() {
    const { searchText } = this.state;

    this.setState({
      loading: true,
    });
    this.updateFilms(searchText);
  }

  handleSearchTextChange = (searchText) => {
    if(searchText === '') return;

    this.setState({
      loading: true,
      searchText,
      currentPage: 1,
      countItems: null,
    });
    this.updateFilms(searchText);
  }

  handleCurrentPageChange = (currentPage) => {
    const { searchText } = this.state;
    this.setState({
      loading: true,
      currentPage
    });

    this.updateFilms(searchText, currentPage);
  }

  handleFilmRateChange = async (filmId, rating) => {
    const { onChangeRatedList } = this.props;

    try {
      const { success } = await this.moviesApiService.rateMovies(filmId, rating);
      if(!success) return;
      
      this.setState(({films}) => {
        return {
          films: films.map(film => {
            if(film.id === filmId) {
              return {
                ...film,
                rating
              }
            }
  
            return film;
          })   
        };
      });

      onChangeRatedList();
    } catch (error) {
      this.setState({
        hasError: true
      });
    }
  }

  updateFilms(query, page) {
    this.moviesApiService.getMovies(query, page)
      .then((json) => {
        const { films, currentPage, countItems } = json;

        this.setState({
          currentPage,
          countItems,
          films,
          loading: false,
          hasError: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          hasError: true
        })
      })
  }

  render() {
    const { films, loading, hasError, currentPage, countItems  } = this.state;
    const hasData = !loading && !hasError;
    
    const error = hasError
      ? <Alert message="Error loading data" type="error" showIcon />
      : null;
    const spinner = loading 
      ? <Spinner /> 
      : null;
    const content = hasData 
      ? <FilmList films={ films } onRateChange={this.handleFilmRateChange} /> 
      : null;
    
    return (
      <>
      <header className="movies-container__search-from">
        <SearchForm onChangeDebounced={this.handleSearchTextChange} />
      </header>
      {spinner}
      {error}
      {content}
      <Pagination 
        className="movies-container__pagination" 
        size="small"
        hideOnSinglePage
        showSizeChanger={false}
        current={currentPage}
        defaultPageSize={20}
        total={countItems}
        onChange={this.handleCurrentPageChange} />
      </>
    );
  }
}

export default SearchPage;