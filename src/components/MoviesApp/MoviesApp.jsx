import React, { Component } from 'react';
import { Layout, Tabs  } from 'antd';

import SearchPage from 'pages/SearchPage';
import RatedPage from 'pages/RatedPage';

import MoviesApiService from 'services/MoviesApiService';
import { GenresProvider } from 'components/GenresContext';

import 'antd/dist/antd.css';
import './MoviesApp.css';

const { Content } = Layout;
const { TabPane } = Tabs;

const moviesApiService = new MoviesApiService();

export default class MoviesApp extends Component {
  state = {
    ratedListChanged: null
  }

  componentDidMount() {
    moviesApiService.getStorableGenres().then((genres) => {
      this.setState({
        genres
      });
    });
  }

  handleChangeRatedList = () => {
    this.setState({
      ratedListChanged: new Date()
    })
  }

  render() {
    const { ratedListChanged, genres } = this.state;

    return (
      <GenresProvider value={genres}>
        <Layout>
          <Content className="movies-container">
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Search" key="1" className="movies-container__tab">
                <SearchPage onChangeRatedList={this.handleChangeRatedList} />
              </TabPane>
              <TabPane tab="Rated" key="2" className="movies-container__tab">
                <RatedPage ratedListChanged={ratedListChanged} />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </GenresProvider>
    );
  }
}