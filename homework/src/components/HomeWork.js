import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Conjugate from "./Conjugate";

class HomeWork extends Component {

  render() {
    return (
       <Router>
    <div>
      <Route path="/homework/conjugate/:verb/:language/:uuid" exact component={Conjugate} />
    </div>
  </Router>
    )
  }
}

export default HomeWork;
