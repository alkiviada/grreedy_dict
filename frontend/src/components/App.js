import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Login from "./Login";
import Register from "./Register";
import Dictionary from "./Dictionary";
import {Provider} from "react-redux";
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import store from "./store";

class App extends Component {
  render () {
    return <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Dictionary} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </BrowserRouter>
    </Provider>
  }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
