import React, { Component } from "react";
import WordsList from "./WordsList";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";
import Menu from "./Menu";

const DictionaryList = (props) => (
  <div className="dict-container">
  <NewWordForm />
  <WordsList page_id={props.match.params.page_id}/>
  <Menu />
  <SaveCollection />
  </div>
)

export default DictionaryList;
