import React, { Component } from "react";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";
import Menu from "./Menu";

const Dictionary = () => (
  <div className="dict-container">
  <NewWordForm />
  <Table />
  <Menu />
  <SaveCollection />
  </div>
)

export default Dictionary;
