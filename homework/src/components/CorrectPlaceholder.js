import React, { Component } from "react";
import PropTypes from "prop-types";

const processString = require('react-process-string');
 
class ProcessCorrect extends Component {
  static propTypes = {
  }

  render() {
    const { correct, answer, homework } = this.props;
    let config = [
     {
      regex: /(\.\.\.)/gm,
      fn: (key, result) => {
        if (!answer) {
          return <div className="right-answer">{correct}</div>
        }
        esle if (correct == answer) {
          return answer 
        }
        else {
          return (<div className="corrections">
            <div className="wrong-answer">{answer}</div>
            <div className="correct-answer">{correct}</div>
            </div>
          )
        }
      }
     },
    ];
    let processed = processString(config)(this.props.homework);
    return <p>{processed}</p>
  }
}

export default ProcessCorrect;
