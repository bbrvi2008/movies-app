import React, { Component } from 'react';
import { Layout, Alert } from 'antd';
import FilmList from '../FilmList';
import Spinner from '../Spinner';
import MoviesApiService from '../../services/MoviesApiService';

import 'antd/dist/antd.css';
import './MoviesApp.css'

const { Content } = Layout;

export default class MoviesApp extends Component {
  moviesApiService = new MoviesApiService();

  state = {
    films: [],
    loading: true,
    hasError: false
  };

  constructor() {
    super();

    this.updateFilms('return');
  }

  updateFilms(query) {
    this.moviesApiService.getMovies(query)
      .then(films => {
        this.setState({
          films,
          loading: false
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
    const { films, loading, hasError } = this.state;
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
          {spinner}
          {error}
          {content}
        </Content>
      </Layout>
    );
  }
}