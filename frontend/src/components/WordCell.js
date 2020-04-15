import React, { Component } from "react";
import { history } from '../components/WordsRoot'
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import Word from "./Word";
import key from "weak-key";
import { connect } from 'react-redux';
import { wordRefToMap } from '../actions/refActions';
import { logWordDivOffset } from '../actions/refActions';
import { nextWord, prevWord, requestWord, fetchWord, clearFetching, lookUpWord } from '../actions/wordsActions';

class WordCell extends Component {
  constructor(props) { 
    super(props)
    this.wordRef = React.createRef();
    this.addToDict = this.addToDict.bind(this) 
  }

  static propTypes = {
    element: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    const { word, offsetMap, tabIndexMap } = this.props
    if (offsetMap[word] && this.wordRef.current && ([0, 1,2].filter(i => i == tabIndexMap[word]).length || !tabIndexMap[word])) {
      console.log('setting scroll top to ', offsetMap[word])
      this.wordRef.current.scrollTop = offsetMap[word]
    }
    this.props.wordRefToMap(word, this.wordRef);
  }

  componentDidMount() {
    const { word } = this.props
    this.props.wordRefToMap(word, this.wordRef);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps 
    console.log(this.wordRef)

    if (nextProps.word == this.props.word && (nextProps.refMap[word] && (nextProps.refMap[word] == this.props.refMap[word])) && (nextProps.tabIndexMap[word] == this.props.tabIndexMap[word])) {
      return 0
    }
    else {
    console.log('should?')
      return 1
    }
  }

  addToDict(e, word, original, parentRef) {
    e.preventDefault();
    const { words, page, allWordsMap, refMap, uuid } = this.props
    console.log(allWordsMap)
    console.log('i will FETCH NEXT')
    console.log(word)

    const parentOffset = this.wordRef.current.offsetTop
    console.log(parentOffset)

    if (parentOffset) {
      this.props.logWordDivOffset(original, parentOffset);
    }
    this.props.requestWord(word)
    console.log('REQUEST FOR WORD')
    history.push(`/word/${word}`);
    if ((words.findIndex(w => w.word == word) == -1) && word) {
      console.log('LOOKing up')
      this.props.requestWord(word);
      this.props.fetchWord(word, uuid).then(() => {
      this.props.clearFetching()
      })
    }
    else 
      this.props.clearFetching()
  }

  render () {
    const { offsetMap, deleteWord, element, word, prev, next } = this.props
    return typeof(element[1]) === 'string' ? (
     <div ref={this.wordRef} className="word-cell">
     <Word wordElement={element} deleteWord={deleteWord} nextWord={next} prevWord={prev} addToDict={this.addToDict} parentRef={this.wordRef} /> 
     </div>
     ) :
     <div className="word-cell">
       <div ref={this.wordRef} className="word-about" key={key(element)}><WordTabs word={word} element={element[1]} addToDict={this.addToDict} parentRef={this.wordRef}/>
      </div>
    </div>  
  }
}

const mapStateToProps = state => ({
  refMap: state.refs.refMap,
  offsetMap: state.refs.offsetMap,
  tabIndexMap: state.tabs.mapTabIndex,
  word: state.words.word,
  allWordsMap: state.words.allWordsMap,
  words: state.words.words,
  collWords: state.collections.collWords,
  pageNext: state.words.pageNext,
  collId: state.collections.uuid,
});

export default connect(mapStateToProps, { wordRefToMap, requestWord, fetchWord, clearFetching, logWordDivOffset })(WordCell);
