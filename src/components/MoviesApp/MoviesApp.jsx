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
    currentTab: "1"
  }

  componentDidMount() {
    moviesApiService.getStorableGenres().then((genres) => {
      this.setState({
        genres
      });
    });
  }

  handleTabClick = (key) => {
    this.setState({
      currentTab: key
    });
  }

  render() {
    const { currentTab, genres } = this.state;

    console.log(currentTab);

    return (
      <GenresProvider value={genres}>
        <Layout>
          <Content className="movies-container">
            <Tabs defaultActiveKey={currentTab} centered onTabClick={this.handleTabClick}>
              <TabPane tab="Search" key="1" className="movies-container__tab">
                {currentTab === "1" ? <SearchPage /> : null}
              </TabPane>
              <TabPane tab="Rated" key="2" className="movies-container__tab">
                {currentTab === "2" ? <RatedPage /> : null}
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </GenresProvider>
    );
  }
}