import React, { Component } from 'react';
import { Layout } from 'antd';
import FilmList from '../FilmList';
import MoviesApiService from '../../services/MoviesApiService';

import 'antd/dist/antd.css';
import './MoviesApp.css'

const { Content } = Layout;

export default class MoviesApp extends Component {
  moviesApiService = new MoviesApiService();

  state = {
    films: []
  };

  constructor() {
    super();

    this.updateFilms('return');
  }

  updateFilms(query) {
    this.moviesApiService.getMovies(query).then(films => {
      this.setState({
        films
      })
    })
  }


  render() {
    const { films } = this.state;

    return (
      <Layout>
        <Content className="movies-container">
          <FilmList films={ films } />
        </Content>
      </Layout>
    );
  }
}