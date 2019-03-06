import React, { Component } from "react";
import WordWidget from "./WordWidget";

const DictionaryWidget = (addWord) => (
  <div className="dict-container">
  <WordWidget addWord={addWord} />
  </div>
)

export default DictionaryWidget;
