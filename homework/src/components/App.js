import React, { Component } from "react";
import ReactDOM from "react-dom";
import Conjugate from "./Conjugate";
import {Provider} from "react-redux";

import store from "./store";

class App extends Component {
  render () {
    return <Provider store={store}>
     <Conjugate />
    </Provider>
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
