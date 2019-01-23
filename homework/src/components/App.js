import React, { Component } from "react";
import ReactDOM from "react-dom";
import HomeWork from "./HomeWork";
import {Provider} from "react-redux";

import store from "./store";

class App extends Component {
  render () {
    return <Provider store={store}>
     <HomeWork />
    </Provider>
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
