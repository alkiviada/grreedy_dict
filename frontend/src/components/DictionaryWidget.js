import React, { Component } from "react";
import { history } from '../components/WordsRoot'
import WordCell from "./WordCell";
import Word from "./Word";
import { connect } from 'react-redux';
import { nextWord, prevWord, requestWord, fetchWord, clearFetching, lookUpWord } from '../actions/wordsActions';
import { withRouter } from "react-router-dom";
import { logWordDivOffset } from '../actions/refActions';

class DictionaryWidget extends Component {
  constructor(props) { 
    super(props)
    this.addToDict = this.addToDict.bind(this) 
    this.wordRef = React.createRef();
  }
  addToDict(e, word, original, direction) {
    direction = direction == 'prev' ? direction : 'next'
    e.preventDefault();
    const { words, page, allWordsMap, refMap, uuid } = this.props
    let redirect = this.props.redirect != 0 ? 1 : 0
    console.log(redirect)
    console.log('i will FETCH NEXT')
    console.log(this.wordRef.current.children[0].children[2].scrollTop)
    const parentOffset = this.wordRef.current.children[0].children[2].scrollTop
    console.log(this.wordRef)
    console.log(parentOffset)
    
    if (parentOffset) {
      this.props.logWordDivOffset(original, parentOffset);
    }
    this.props.requestWord(word)
    console.log('REQUEST FOR WORD')
    if ((words.findIndex(w => w.word == word) == -1) && word) {
      console.log('LOOKing up')
      this.props.requestWord(word);
      this.props.fetchWord(word, direction).then(() => {
      this.props.clearFetching()
      })
    }
    else 
      this.props.clearFetching()
      if (redirect) {
        console.log(redirect)
        history.push(`/word/${word}`);
      }
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

  render () {
    const { word, words, collWords, pageNext, pagePrev } = this.props
    console.log('those are my words')
    console.log(word)
    console.log(words.map(w => w.word))
    console.log(collWords)
    console.log('my words')

    const wordElementIndex = words.findIndex(w => w.word == word);
    let prevWord = words[wordElementIndex+1]
    prevWord = prevWord ? prevWord.word : ''
    if (!prevWord) {
      const wordIdx = collWords.findIndex(w => w == word)  
      prevWord = collWords[wordIdx+1]
      if(!prevWord && pageNext) {
        prevWord = pageNext
      }
    }
    let nextWord = words[wordElementIndex-1]
    nextWord = nextWord ? nextWord.word : ''
    if (!nextWord) {
      const wordIdx = collWords.findIndex(w => w == word)  
      nextWord = collWords[wordIdx-1]
      if (!nextWord && pagePrev) {
        nextWord = pagePrev
      }
    }
     console.log('next') 
     console.log(nextWord) 
     console.log('prev') 
     console.log(prevWord) 
     

    const wordElement = wordElementIndex != -1 ? words[wordElementIndex] : ''
    console.log(wordElement)

  return wordElement ? ( <div className="dict">
  <div className="words-rows"> 
  <div className="word-cell" ref={this.wordRef}><Word parentRef={this.wordRef} wordElement={wordElement} nextWord={nextWord} prevWord={prevWord} addToDict={this.addToDict} /></div> 
  <WordCell addToDict={this.addToDict} wordRef={this.wordRef} word={this.props.word} element={wordElement} next={nextWord} prev={prevWord} />
  </div></div>
  ) : ''
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
