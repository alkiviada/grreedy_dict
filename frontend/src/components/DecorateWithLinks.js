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
      regex: /([a-zA-Z\-À-ÿА-Я\ǣāēіїœiĭī]+)/gim,
      fn: (key, result) => 
        <a target="_blank" href={`/word/${result[1].toLowerCase()}`} data-word-tool-tip="look up"
          onClick={(e) => onLinkClick(e, result[1].toLowerCase(), original, parentRef)} className="word-link">
        {result[1]}
        </a>
    }, 
    ];
    let processed = processString(config)(this.props.words);
    return (
      <div>{processed}</div>
    );
  }
}

const WordLink = props => {
  return (
    <a className="word-link">{props.word}</a>
  );
};

export default DecorateWithLinks;
