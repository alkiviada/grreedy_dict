import React, { Component } from "react";
import PropTypes from "prop-types";

import Placeholder from "./Placeholder";

const processString = require('react-process-string');
 
class ProcessPlaceholder extends Component {
  static propTypes = {
  }

  render() {
    const { pref, homework } = this.props;
    let config = [
     {
      regex: /(\.\.\.)/gm,
      fn: (key, result) => {
        return <Placeholder pref={pref}/> 
      }
     },
    ];
    let processed = processString(config)(this.props.homework);
    return <p>{processed}</p>
  }
}

export default ProcessPlaceholder;
