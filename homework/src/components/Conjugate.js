import React, { Component } from "react";
import Verbs from "./Verbs";
import ConjugateHomeWork from "./ConjugateHomeWork";
import JustConjugate from "./JustConjugate";

const Conjugate = () => (
  <div className="conjugate-container">
  <Verbs />
  <JustConjugate />
  <ConjugateHomeWork />
  </div>
)

export default Conjugate;
