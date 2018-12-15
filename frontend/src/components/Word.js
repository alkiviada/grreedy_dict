import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";

const Word = (props) => {
  const { wordElement, visibilityFilter, visibility } = props;
  return ( 
    <div className="word" key={key(wordElement)}>
    <strong className="just-word">{wordElement[1]}</strong>
    { visibility == 'hide' ? <a className="word-show fas fa-arrow-down" onClick={(e) => visibilityFilter(e, wordElement[1])}></a> :
    <a className="word-hide fas fa-arrow-up" onClick={(e) => visibilityFilter(e, wordElement[1])}></a> }
    </div>
  );
}

Word.propTypes = {
  wordElement: PropTypes.object.isRequired,
  visibility: PropTypes.string.isRequired,
  visibilityFilter: PropTypes.func.isRequired,
};  
    
export default Word;
