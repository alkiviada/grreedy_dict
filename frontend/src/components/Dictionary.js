import React, { Component } from "react";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";
import Menu from "./Menu";

const Dictionary = (props) => (
  <div className="dict-container">
  <NewWordForm />
  <Table page_id={props.match.params.page_id}/>
  <Menu />
  <SaveCollection />
  </div>
)

export default Dictionary;
