import React, { Component } from "react";
import Verbs from "./Verbs";
import ConjugateHomeWork from "./ConjugateHomeWork";
import JustConjugateTabs from "./JustConjugateTabs";

class Conjugate extends Component {
  render() {
  console.log(this.props.match.params)
  const { verb, language } = this.props.match.params 

  return <div className="conjugate-container">
  <Verbs />
  <JustConjugateTabs verb={verb} language={language} />
  <ConjugateHomeWork />
  </div>
  }
}

export default Conjugate;
