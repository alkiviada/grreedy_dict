import React, { Component } from "react";
import WordWidget from "./WordWidget";

const DictionaryWidget = (props) => (
  <div className="dict-container">
  <WordWidget addWord={props.addWord} />
  </div>
)

export default DictionaryWidget;
