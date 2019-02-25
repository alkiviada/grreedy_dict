import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import Word from "./Word";
import key from "weak-key";
import { connect } from 'react-redux';

class WordWidget extends Component {
  constructor(props) { 
    super(props)
  }

  static propTypes = {
  };

  shouldComponentUpdate(nextProps, nextState) {
    const newWord = nextProps.word
    const newWordElement = nextProps.words.find(w => w.word == newWord);
    console.log(newWordElement)
    if (newWordElement) {
      console.log('i will update')
      return true 
    }
    return false 
  }

  render () {
    const { addWord, word, words } = this.props
    const wordElement = words.find(w => w.word == word);
    console.log(wordElement)
    if (wordElement) {
    return <Fragment> 
     <Word word={word} el={wordElement} /> 
     <WordTabs word={wordElement} addWord={addWord} />
     </Fragment>
     }
     else 
       return ''
  }
}

const mapStateToProps = state => ({
  word: state.words.word,
  words: state.words.words,
});

export default connect(mapStateToProps, { })(WordWidget);
