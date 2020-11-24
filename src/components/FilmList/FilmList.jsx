import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';

import Film from '../Film';

const FilmList = ({ films }) => (
  <List
    grid={{ gutter: [32, 32], column: 2 }}
    dataSource={films}
    
    renderItem={({id, ...film}) => (
      <List.Item>
        <Film {...film} />
      </List.Item>
    )}
  />
);

FilmList.defaultProps = {
  films: []
};

FilmList.propTypes = {
  films: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    genres: PropTypes.arrayOf(PropTypes.string),
    poster: PropTypes.string
  }))
};


export default FilmList;