import React, { Component } from "react";
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
  }

  static propTypes = {
    element: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    console.log('I DID UPDATE')
    const { word, offsetMap, tabIndexMap } = this.props
    console.log(offsetMap)
    console.log(this.props.wordRef.current)
    if (offsetMap[word] && this.props.wordRef.current && ([0, 1,2].filter(i => i == tabIndexMap[word]).length || !tabIndexMap[word])) {
      console.log('setting scroll top to ', offsetMap[word])
      this.props.wordRef.current.scrollTop = offsetMap[word]
    }
    console.log(this.props.wordRef.current.children[0].children[2].scrollTop)
    if (this.props.wordRef.current) {
    this.props.wordRef.current.children[0].children[2].scrollTop = offsetMap[word];
    }
    this.props.wordRefToMap(word, this.props.wordRef);
  }

  componentDidMount() {
    const { word } = this.props
    this.props.wordRefToMap(word, this.props.wordRef);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps 
    console.log('shoud i update')
    console.log(nextProps)
    console.log(this.props)

    if ((nextProps.word == this.props.word) && (nextProps.refMap[word] && (nextProps.refMap[word] == this.props.refMap[word])) && (nextProps.tabIndexMap[word] == this.props.tabIndexMap[word])) {
      console.log('i will NOT update')
      return 0
    }
    else {
      console.log('i WILL update')
      return 1
    }
  }


  render () {
    console.log('render WORD CELL')
    const { offsetMap, element, word, prev, next, wordRef } = this.props
    console.log(element)
    console.log(offsetMap)
    console.log(this.props.refMap)
    return (
     <div className="word-cell">
       <div ref={wordRef} className="word-about" key={key(element)}><WordTabs word={word} element={element['description']} addToDict={this.props.addToDict} parentRef={this.props.wordRef}/>
      </div>
    </div>) 
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
