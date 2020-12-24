import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Row, Col, Typography, Space, Rate } from 'antd';

import { GenresConsumer } from 'components/GenresContext';
import FilmRate from '../FilmRate';

import { getShortText } from '../../utils/TextUtils';

import './Film.css';

const Film = ({ title, description, date, genres, poster, rate, rating, onRateChange }) => (
  <Row className="film-item">
    <Col xs={24} sm={24} md={9} className="film-item__img-wrapper" >
      {poster && <img src={ poster } alt="poster" className="film-item__img" />}
    </Col>
    <Col xs={24} sm={24} md={15} className="film-item__content" >
      <Typography.Title level={4} className="film-item__title" >{title}</Typography.Title>
      <FilmRate className="film-item__rating test" value={rate} />
      <Space size={7} direction="vertical">
        <Typography.Text type="secondary">{date && format(date, 'MMMM d, Y')}</Typography.Text>
        <GenresConsumer>
          {
            (dictionaryGenres) => {
              return (
                  genres.map(genreId => (
                    <Typography.Text code key={genreId} className="film-item__genre" ><nobr>{dictionaryGenres[genreId]}</nobr></Typography.Text>
                  ))
              );
            }
          }
        </GenresConsumer>
        <Typography.Text>{getShortText(description)}</Typography.Text>
      </Space>
      <Rate className="film-item__rate" allowHalf count={10} value={rating} onChange={onRateChange} />
    </Col>
  </Row>
);

Film.defaultProps = {
  title: null,
  description: null,
  date: null,
  genres: [],
  poster: null,
  rate: null,
  rating: null,
  onRateChange: () => null
};

Film.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  genres: PropTypes.arrayOf(PropTypes.number),
  poster: PropTypes.string,
  rate: PropTypes.number,
  rating: PropTypes.number,
  onRateChange: PropTypes.func
};

export default Film;