import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { fetchWords } from '../actions/wordsActions';

class DataProvider extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    fetchWords: PropTypes.func.isRequired,
  };
  componentWillMount() {
    this.props.fetchWords();
  }
  render() {
    return this.props.render(data);
  }
}

const mapStateToProps = state => ({
  data: state.words.items,
});


export default connect(mapStateToProps, { fetchWords })(DataProvider);
