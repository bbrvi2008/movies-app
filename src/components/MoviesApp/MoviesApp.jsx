import React, { Component } from 'react';
import { Layout, Alert, Pagination } from 'antd';

import SearchForm from '../SearchForm';
import FilmList from '../FilmList';
import Spinner from '../Spinner';

import MoviesApiService from '../../services/MoviesApiService';

import 'antd/dist/antd.css';
import './MoviesApp.css'

const { Content } = Layout;

export default class MoviesApp extends Component {
  moviesApiService = new MoviesApiService();

  state = {
    searchText: 'return',
    currentPage: 1,
    countItems: null,
    films: [],
    loading: false,
    hasError: false
  };

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

  updateFilms(query, page) {
    this.moviesApiService.getMovies(query, page)
      .then(({ films, currentPage, countItems }) => {
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
      ? <FilmList films={ films } /> 
      : null;

    return (
      <Layout>
        <Content className="movies-container">
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
        </Content>
      </Layout>
    );
  }
}