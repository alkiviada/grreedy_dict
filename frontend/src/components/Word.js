import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import key from "weak-key";

const Word = (props) => {
  const { wordElement, parentRef, deleteWord, nextWord, prevWord, addToDict } = props;
  console.log('render WORD')
  console.log(prevWord) 
  console.log(nextWord) 

  const original = wordElement[1]
  const wl =  wordElement[1].length
  const l = 10.9 * wl + 18
  return ( 
    <div className="word" key={key(wordElement)}>
    { nextWord ? <button className="word-nav next" onClick={(e) => addToDict(e, nextWord, original, parentRef)}>&larr;</button> : ''}
    <svg className="word-bare-svg"   
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={"0 -2 " + l + " 23"} preserveAspectRatio="xMidYMid meet">
      <text x="2" y="15" className="word-bare-svg-text">
    {wordElement[1]}
      </text>
     </svg>
    { prevWord ? <button className="word-nav prev" onClick={(e) => addToDict(e, prevWord, original, parentRef)}>&rarr;</button> : '' }
    </div>
  );
}

Word.propTypes = {
  wordElement: PropTypes.object.isRequired,
};  
    
export default Word;
