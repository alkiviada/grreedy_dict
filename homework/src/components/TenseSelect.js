import React, { Component } from "react";
import { connect } from 'react-redux';

import { TENSES } from '../actions/helpers'

class TenseSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tenseIdx: '0' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.logTabTense(event.target.value)
    console.log(event.target.value)
    this.setState({ tenseIdx: event.target.value });
    if (this.props.onChangeFunc) {
        this.props.onChangeFunc()
    }
  }

  render() {
    const { tenses } = this.props
    return (
          <select value={this.state.tenseIdx} onChange={this.handleChange}>
            { tenses.map(t => <option value={t}>{TENSES[t]}</option>) }
          </select>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(TenseSelect);
