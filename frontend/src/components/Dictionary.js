import React, { Component } from "react";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";

const Dictionary = () => (
  <div className="dict-container">
  <NewWordForm />
  <Table />
  <CollectionsSideBar />
  <SaveCollection />
  </div>
)

export default Dictionary;
