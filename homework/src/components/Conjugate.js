import React, { Component } from "react";
import Verbs from "./Verbs";
import ConjugateHomeworkTabs from "./ConjugateHomeworkTabs";
import DictionaryWidget from "./DictionaryWidget";
import JustConjugateTabs from "./JustConjugateTabs";
import { connect } from 'react-redux';
import { requestVerb } from '../actions/verbsActions';
import { lookUpWord, requestWord, registerUUId } from '../actions/wordsActions';

const mapStateToProps = state => ({
  words: state.dict.words,
  word: state.dict.word,
  uuid: state.dict.uuid,
});

class Conjugate extends Component {
  constructor(props) { 
    super(props)
    this.addWord = this.addWord.bind(this) 
  }
  
  componentDidMount () {
    const { verb, language, uuid } = this.props.match.params 
    console.log(uuid)
    console.log('this is my verb ', verb);
    this.props.requestVerb(verb, language)
    if (uuid)
      this.props.registerUUId(uuid)
  }

  addWord (e, word) {
    e.preventDefault();
    const { words } = this.props
    console.log('looking up')
    this.props.requestWord(word)
    this.props.lookUpWord(word).then(() => {
      console.log(this.props.words)
    })
  }

  render() {
    const { verb, language, uuid } = this.props.match.params 
    console.log(uuid)
    const { word, words } = this.props 
    console.log(word)
    console.log(words)
    console.log(words || word)

    return (
      <div className="conjugate-container">
       <div className="verb-title">{verb}</div>
       <Verbs />
       <JustConjugateTabs verb={verb} language={language} />
       <div className="conjugate-homework-paper"><ConjugateHomeworkTabs verb={verb} language={language} addWord={this.addWord} /></div>
       { word || words.length ? <DictionaryWidget addWord={this.addWord} /> : '' }
      </div>
    )}
}

export default connect(mapStateToProps, { requestVerb, lookUpWord, requestWord, registerUUId })(Conjugate);
