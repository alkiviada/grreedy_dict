import React, { Component } from "react";
import { connect } from 'react-redux';

import { tenses } from './helpers'
import { logTenseIdx } from '../actions/conjugsActions'

class TenseSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tenseIdx: '0' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.logTenseIdx(event.target.value)
    console.log(event.target.value)
    this.setState({ tenseIdx: event.target.value });
  }

  render() {
    return (
          <select value={this.state.tenseIdx} onChange={this.handleChange}>
            { tenses.map((t, i) => <option value={i}>{t}</option>) }
          </select>
    );
  }
}
const mapDispatchToProps = {
  logTenseIdx, 
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TenseSelect);
