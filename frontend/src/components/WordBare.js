import React, { Component, } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import key from "weak-key";

const WordBare = (props) => {
  const { word, deleteWord, key } = props;
  console.log('render')
  const wl =  word.length
  const l = 10.9 * wl + 18
  return ( 
    <li className="word-list-item" key={key}>
    <Link className="is-link is-word-link" to={`/word/${word}`}>{word}</Link>
    <button className="word-delete" onClick={(e) => deleteWord(e, word)}>x</button>
    </li>
  );
}

WordBare.propTypes = {
  word: PropTypes.object.isRequired,
};  
    
export default WordBare;
