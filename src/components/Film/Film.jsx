import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Row, Col, Typography, Space } from 'antd';

import { getShortText } from '../../utils/TextUtils';

import './Film.css';

const Film = ({ title, description, date, genres, poster }) => (
  <Row className="film-item">
    <Col flex="2">
      <img src={ poster } alt="poster" className="film-item__img" />  
    </Col>
    <Col flex="3" className="film-item__content" >
      <Typography.Title level={4}>{title}</Typography.Title>
      <Space size={7} direction="vertical">
        <Typography.Text type="secondary">{date && format(date, 'MMMM d, Y')}</Typography.Text>
        <Space size={8} >
          {genres.map(genre => (
            <Typography.Text code key={genre}>{genre}</Typography.Text>
          ))}
        </Space>
        <Typography.Text>{getShortText(description)}</Typography.Text>
      </Space>
    </Col>
  </Row>
);

Film.defaultProps = {
  title: null,
  description: null,
  date: null,
  genres: [],
  poster: null
};

Film.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  genres: PropTypes.arrayOf(PropTypes.string),
  poster: PropTypes.string
};

export default Film;