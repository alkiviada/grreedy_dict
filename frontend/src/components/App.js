import React, { Component } from "react";
import ReactDOM from "react-dom";
import WordsRoot from "./WordsRoot";
import {Provider} from "react-redux";

import "whatwg-fetch";
import "promise-polyfill/src/polyfill";
import "@babel/polyfill"; 

import store from "./store";

class App extends Component {
  render () {
    return <Provider store={store}>
    <WordsRoot />
    </Provider>
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
