import React, { Component } from "react";
import WordCell from "./WordCell";

const DictionaryWidget = (props) => (
  <div className="dict">
  <div className="words-rows"> 
  { Object.entries(props.word).map(el => <WordCell word={props.word.word} element={el} addRow={props.addToDict} />) }
  </div>
  </div>
)

export default DictionaryWidget;
