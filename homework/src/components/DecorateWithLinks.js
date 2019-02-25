import React, { Component } from "react";
import PropTypes from "prop-types";

const processString = require('react-process-string');
 
class DecorateWithLinks extends Component {
  static propTypes = {
    words: PropTypes.array,
    onLinkClick: PropTypes.func.isRequired,
  }
  render() {
    const { words, onLinkClick, original, parentRef } = this.props;
    console.log(onLinkClick)
    let config = [
     {
      regex: /(\{)(.*?)(\})/gm,
      fn: (key, result) => {
        return <span className="word-meaning">
        {result[2]}
          </span>
      }
     },
     {
      regex: /([a-zA-Z\-À-ÿА-Я\ǣāēіїœ]+)/gim,
      fn: (key, result) => 
        <a target="_blank" href={`/api/word/${result[1]}`} data-word-tool-tip="look up"
          onClick={(e) => onLinkClick(e, result[1])} className="word-link">
        {result[1]}
        </a>
    }, 
    ];
    let processed = processString(config)(this.props.words);
    return processed;
  }
}

const WordLink = props => {
  return (
    <a className="word-link">{props.word}</a>
  );
};

WordLink.propTypes = {
  word: PropTypes.string,
};

export default DecorateWithLinks;
