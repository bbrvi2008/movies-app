import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Alert, Pagination } from 'antd';

import FilmList from 'components/FilmList';
import Spinner from 'components/Spinner';

import MoviesApiService from 'services/MoviesApiService';

class RatedPage extends Component {
  static defaultProps = {
    ratedListChanged: null
  };

  static propTypes = {
    ratedListChanged: PropTypes.instanceOf(Date)
  }

  moviesApiService = new MoviesApiService();

  state = {
    currentPage: 1,
    countItems: null,
    films: [],
    loading: false,
    hasError: false
  };

  componentDidMount() {
    this.updateFilms();
  }

  componentDidUpdate({ ratedListChanged: prevRatedListChanged }) {
    const { ratedListChanged } = this.props;

    if(ratedListChanged !== prevRatedListChanged) {
      this.updateFilms();
    }
  }

  handleFilmRateChange = async (filmId, rating) => {
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
    } catch (error) {
      this.setState({
        hasError: true
      });
    }
  }

  handleCurrentPageChange = (currentPage) => {
    this.setState({
      currentPage
    });

    this.updateFilms(currentPage);
  }

  updateFilms(page) {
    this.setState({
      loading: true
    });

    this.moviesApiService.getRatedMovies(page)
      .then((json) => {
        const { films, currentPage, countItems } = json;

        this.setState({
          currentPage,
          countItems,
          films,
          loading: false,
          hasError: false
        })
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

export default RatedPage;