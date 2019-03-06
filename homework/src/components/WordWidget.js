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
    const fetching = nextProps.fetching
    const newWordElement = nextProps.words.find(w => w.word == newWord);
    if (fetching) {
      return true 
    }
    if (newWordElement) {
      return true 
    }
    return false 
  }

  render () {
    const { addWord, word, words, fetching } = this.props
    const wordElement = words.find(w => w.word == word);
    if (wordElement) {
    return <Fragment> 
     <Word word={word} el={wordElement} /> 
     <WordTabs word={wordElement} addWord={addWord} />
     </Fragment>
     }
     else {
       if (fetching) {
         return <div className="word"><strong className="just-word">{word}</strong>
                <div className="word-tabs-empty"><em>Loading</em></div>
                </div>
       }
       else 
         return ''
     }
  }
}

const mapStateToProps = state => ({
  word: state.words.word,
  words: state.words.words,
  fetching: state.words.wordFetching,
});

export default connect(mapStateToProps, { })(WordWidget);
