import React, { Component } from "react";
import { connect } from 'react-redux';

import { tenses } from './helpers'

class TenseSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tenseIdx: '0' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log(this.props)
    this.props.logTabTense(event.target.value)
    console.log(event.target.value)
    this.setState({ tenseIdx: event.target.value });
    if (this.props.onChangeFunc) {
        this.props.onChangeFunc()
    }
  }

  render() {
    return (
          <select value={this.state.tenseIdx} onChange={this.handleChange}>
            { tenses.map((t, i) => <option value={i}>{t}</option>) }
          </select>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(TenseSelect);
