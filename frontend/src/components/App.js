import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import CollectionsSideBar from "./CollectionsSideBar";
import {Provider} from "react-redux";

import store from "./store";

class App extends Component {
  render () {
    return <Provider store={store}><div className="dict-container"><NewWordForm />
    <section class="main-content columns is-fullheight">
    <Table /><CollectionsSideBar />
    </section>
    <SaveCollection /></div></Provider>
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
