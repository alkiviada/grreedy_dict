import React, { Component } from "react";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";
import SideMenu from "./SideMenu";

const Dictionary = () => (
  <div className="dict-container">
  <NewWordForm />
  <Table />
  <SideMenu />
  <SaveCollection />
  </div>
)

export default Dictionary;
