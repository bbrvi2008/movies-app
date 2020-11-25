import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

class SearchForm extends Component {
  static defaultProps = {
    onChangeDebounced: () => null
  }
  
  static propTypes = {
    onChangeDebounced: PropTypes.func
  }
  
  state = {
    searchText: ''
  }

  componentDidMount() {
    const { onChangeDebounced } = this.props;

    this.handleChangeDebounced = debounce(onChangeDebounced, 500);
  }

  handleChange = (event) => {
    const { value } = event.target;

    this.setState({
      searchText: value
    });

    this.handleChangeDebounced(value);
  }

  render() {
    const { searchText } = this.state;

    return (
      <Form>
        <Form.Item name="search" >
          <Input  placeholder="Type to search..." allowClear value={searchText} onChange={this.handleChange} />
        </Form.Item>
      </Form>
    );
  }
}

export default SearchForm;