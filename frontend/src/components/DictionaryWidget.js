import React, { Component } from "react";
import WordCell from "./WordCell";
import { connect } from 'react-redux';
import { nextWord, prevWord, requestWord, fetchWord, clearFetching, lookUpWord } from '../actions/wordsActions';
import { withRouter } from "react-router-dom";
import { logWordDivOffset } from '../actions/refActions';

class DictionaryWidget extends Component {
  constructor(props) { 
    super(props)
  }

  componentDidMount() {
    const word = this.props.match.params.word
    const words = this.props.words
    console.log('mounting word');
    console.log(word)
    if (word) {
      this.props.requestWord(word)
      if (words.findIndex(w => w.word == word) == -1) {
        this.props.fetchWord(word).then(() => { 
      })
      }
      else 
        this.props.clearFetching()
    }
  }
  prevWord(e, word) {
    e.preventDefault();
  }

  render () {
    const { word, words, collWords, pageNext, pagePrev } = this.props
    console.log('those are my words')
    console.log(word)
    console.log(words)
    console.log(collWords)
    console.log('my words')

    const wordElementIndex = words.findIndex(w => w.word == word);
    console.log(wordElementIndex)
    let prevWord = words[wordElementIndex+1]
    prevWord = prevWord ? prevWord.word : ''
    if (!prevWord) {
      const wordIdx = collWords.findIndex(w => w == word)  
      prevWord = collWords[wordIdx+1]
      if(!prevWord && pagePrev) {
        prevWord = pageNext
      }
    }
    let nextWord = words[wordElementIndex-1]
    nextWord = nextWord ? nextWord.word : ''
    if (!nextWord) {
      const wordIdx = collWords.findIndex(w => w == word)  
      nextWord = collWords[wordIdx-1]
      if (!nextWord && pageNext) {
        nextWord = pagePrev
      }
    }
     console.log('next') 
     console.log(nextWord) 
     console.log('prev') 
     console.log(prevWord) 
     

    const wordElement = wordElementIndex != -1 ? words[wordElementIndex] : ''
    console.log(wordElement)
  return ( <div className="dict">
  <div className="words-rows"> 
  { Object.entries(wordElement).map(el => <WordCell word={this.props.word} element={el} next={nextWord} prev={prevWord} />) }
  </div>
  </div>
)
}
}

const mapStateToProps = state => ({
  refMap: state.refs.refMap,
  word: state.words.word,
  allWordsMap: state.words.allWordsMap,
  pageNext: state.words.pageNext,
  pagePrev: state.words.pagePrev,
  words: state.words.words,
  collWords: state.collections.collWords,
  collId: state.collections.uuid,
});

export default withRouter(connect(mapStateToProps, 
                                 { nextWord, 
                                   prevWord, 
                                   requestWord, fetchWord, clearFetching,  logWordDivOffset })(DictionaryWidget))
