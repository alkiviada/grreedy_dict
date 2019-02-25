import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";

const Word = (props) => {
  const { word, el } = props;
  console.log('just a word')
  return ( 
    <div className="word" key={key(el)}>
    <strong className="just-word">{word}</strong>
    </div>
  );
}

Word.propTypes = {
  word: PropTypes.string.isRequired,
};  
    
export default Word;
