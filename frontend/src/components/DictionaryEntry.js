import React, { Component } from "react";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import DictionaryWidget from "./DictionaryWidget";
import CollectionsSideBar from "./CollectionsSideBar";
import Menu from "./Menu";

const DictionaryEntry = (props) => (
  <div className="dict-container">
  <NewWordForm />
  <DictionaryWidget word={props.match.params.word}/>
  <Menu />
  <SaveCollection />
  </div>
)

export default DictionaryEntry;
