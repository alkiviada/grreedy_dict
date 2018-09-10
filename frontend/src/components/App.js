import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Table from "./Table";
import NewWordForm from "./NewWordForm";
import SaveCollection from "./SaveCollection";
import {Provider} from "react-redux";

import store from "./store";

class App extends Component {
  componentWillMount() {
    for(let i in styles.body){
      document.body.style[i] = styles.body[i];
    }
  }
  render () {
    return <Provider store={store}><div><NewWordForm /><Table /><SaveCollection /></div></Provider>
  }
}

const img = '/static/frontend/img/36655700945_5f48011db9_k.jpg';
const styles = { 
  body: {
    background: 'linear-gradient(#84a6d2, #b2b8c4, #856831)',
    backgroundImage: 'url("'+img+'")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    fontFamily: 'Abel',
    maxHeight: '100%',
    minHeight: '100vh',
    height: '100%',
    width: '100%',
  }
};

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
