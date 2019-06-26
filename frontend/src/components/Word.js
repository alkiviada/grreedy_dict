import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";

const Word = (props) => {
  const { wordElement, visibilityFilter, visibility, deleteWord } = props;
  const wl =  wordElement[1].length
  const l = 8.2 * wl + 18
  console.log(l)
  return ( 
    <div className="word" key={key(wordElement)}>
    <svg className="word-svg"   
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={"0 0 " + l + " 25"} preserveAspectRatio="xMidYMid meet">
      <text x="0" y="17" className="word-svg-text">
    {wordElement[1]}
      </text>
     </svg>
    { visibility == 'hide' ? <button className="word-show" onClick={(e) => visibilityFilter(e, wordElement[1])}>></button> :
    <button className="word-hide" onClick={(e) => visibilityFilter(e, wordElement[1])}>></button> }
    <button className="word-delete" onClick={(e) => deleteWord(e, wordElement[1])}>x</button>
    </div>
  );
}

Word.propTypes = {
  wordElement: PropTypes.object.isRequired,
  visibility: PropTypes.string.isRequired,
  visibilityFilter: PropTypes.func.isRequired,
};  
    
export default Word;
