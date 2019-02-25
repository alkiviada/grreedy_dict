import React, { Component } from "react";
import Verbs from "./Verbs";
import ConjugateHomeworkTabs from "./ConjugateHomeworkTabs";
import DictionaryWidget from "./DictionaryWidget";
import JustConjugateTabs from "./JustConjugateTabs";
import { connect } from 'react-redux';
import { requestVerb } from '../actions/verbsActions';
import { lookUpWord, requestWord, } from '../actions/wordsActions';

const mapStateToProps = state => ({
});

class Conjugate extends Component {
  constructor(props) { 
    super(props)
    console.log(props)
    this.addWord = this.addWord.bind(this) 
  }
  
  componentDidMount () {
    const { verb, language } = this.props
    console.log('i will be mounting my main conjugate container')
    this.props.requestVerb(verb, language)
  }

  addWord (e, word) {
    e.preventDefault();
    console.log(word)
    console.log('looking up')
    this.props.requestWord(word)
    this.props.lookUpWord(word).then(() => {
      console.log(this.props.words)
    })
  }

  render() {
    const { verb, language } = this.props.match.params 
    console.log(' i am conjugate')
    console.log(this.addWord)

  return (
    <div className="conjugate-container">
     <div className="verb-title">{verb}</div>
     <Verbs />
     <JustConjugateTabs verb={verb} language={language} />
     <ConjugateHomeworkTabs verb={verb} language={language} addWord={this.addWord} />
     <DictionaryWidget addWord={this.addWord} />
    </div>
  )}
}

export default connect(mapStateToProps, { requestVerb, lookUpWord, requestWord })(Conjugate);
