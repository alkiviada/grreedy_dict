import React, { Component } from "react";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";

const Dictionary = () => (
  <div className="dict-container">
  <NewWordForm />
  <section class="main-content columns">
  <Table />
  <CollectionsSideBar />
  </section>
  <SaveCollection />
  </div>
)

export default Dictionary;
