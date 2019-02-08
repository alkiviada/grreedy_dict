import React, { Component } from "react";
import Verbs from "./Verbs";
import ConjugateHomeworkTabs from "./ConjugateHomeworkTabs";
import JustConjugateTabs from "./JustConjugateTabs";
import { connect } from 'react-redux';
import { requestVerb } from '../actions/verbsActions';

const mapStateToProps = state => ({
});

class Conjugate extends Component {
  
  componentDidMount () {
    const { verb, language } = this.props
    console.log('i will be mounting my main conjugate container')
    this.props.requestVerb(verb, language)
  }

  render() {
  console.log(this.props.match.params)
  const { verb, language } = this.props.match.params 

  return (
    <div className="conjugate-container">
     <div className="verb-title">{verb}</div>
     <Verbs />
     <JustConjugateTabs verb={verb} language={language} />
     <ConjugateHomeworkTabs verb={verb} language={language} />
    </div>
  )}
}

export default connect(mapStateToProps, { requestVerb, })(Conjugate);
