import React, { Component } from "react";
import PropTypes from "prop-types";

import Placeholder from "./Placeholder";

const processString = require('react-process-string');
 
class ProcessPlaceholder extends Component {
  static propTypes = {
  }

  render() {
    const { pref, homework, pp, fn } = this.props;
    let config = [
     {
      regex: /(\.\.\.)/gm,
      fn: (key, result) => {
        return <Placeholder pref={pref}/> 
      }
     },
    ];
    let processed = processString(config)(this.props.homework);
    if (pp) {
      const PostProcess = pp
      return <PostProcess words={processed} onLinkClick={fn} />
    }
    else {
      return processed
    }
  }
}

export default ProcessPlaceholder;
