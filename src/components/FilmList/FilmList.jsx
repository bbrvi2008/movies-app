import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';

import Film from '../Film';

const FilmList = ({ films, onRateChange }) => (
  <List
    grid={{ gutter: [32, 16], column: 2, xs: 1, sm: 1, md: 1 }}
    dataSource={films}
    renderItem={({id, ...film}) => (
      <List.Item>
        <Film {...film} onRateChange={(rate) => onRateChange(id, rate)} />
      </List.Item>
    )}
  />
);

FilmList.defaultProps = {
  films: [],
  onRateChange: () => null
};

FilmList.propTypes = {
  films: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    genres: PropTypes.arrayOf(PropTypes.number),
    rate: null,
    rating: null,
    poster: PropTypes.string
  })),
  onRateChange: PropTypes.func
};


export default FilmList;