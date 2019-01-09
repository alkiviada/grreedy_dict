import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord, requestWord, clearNewWordError } from '../actions/wordsActions';
import { scrollToDomRef } from './helpers';

class NewWordForm extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      word: '',
    };
    this.handleWordChange = this.handleWordChange.bind(this);
    this.onSubmit = this.onSubmitLookUp.bind(this);
  };

  componentDidUpdate() {
    const { word, page, allWordsMap, refMap } = this.props
    console.log(word)
    console.log('i updated')
    console.log(refMap[word])
    if (refMap[word] && refMap[word].current)
      scrollToDomRef(refMap[word], 80)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { newWord, fetching } = nextProps
    const word = this.props.word
    if (word && word == newWord && fetching)
      return false
    return true
  }

  handleWordChange(w) {
   if (this.props.error) {
     this.props.clearNewWordError();
   }
   this.setState({word: w.target.value});
  }

  onSubmitLookUp(e) {
    e.preventDefault();
    console.log('looking up');
    const { word } = this.state
    const { page, allWordsMap, refMap } = this.props
    console.log(refMap[word])
    if (refMap[word]) 
      console.log(this.props.refMap[word].current)
    if (!this.props.allWordsMap[this.state.word]) {
      this.props.requestWord(word);
      this.props.lookUpWord(this.state.word, this.props.uuid).then(() => {
        console.log(refMap[word])
        if (refMap[word] && refMap[word].current)
          scrollToDomRef(refMap[word], 80)
      })
    }
    else if (this.props.refMap[word]) {
      console.log('i am here will scroll to exisitng')
      if (allWordsMap[word] != page) {
        this.props.fetchWords(allWordsMap[word]).then(() => {
          scrollToDomRef(refMap[word], 80)
        })
      }
      else {
        scrollToDomRef(this.props.refMap[word], 80)
      }
    }
    this.setState({word: ''})
  }

  render () {
    const fetching = this.props.fetching;
    const word = !this.props.error ? this.state.word : this.props.word
    console.log('rendering new word form');
    return (
      !fetching ? 
      <form className="new-word" onSubmit={(e) => this.onSubmitLookUp(e)}> 
        <input className="new-word-input" type="text" placeholder="New Word" value={word} onChange={this.handleWordChange} />
        <a className="new-word-btn look-up-btn" onClick={(e) => this.onSubmitLookUp(e)}>Look Up</a>
      { this.props.error ? <div className="grid-warn">Can't load word</div> : '' }
    </form> : <div className="new-word"><p className="grid-notification"><em>Loading...</em></p></div>
    );
  }
};

const mapStateToProps = state => ({
  uuid: state.collections.uuid,
  allWordsMap: state.words.allWordsMap,
  allWords: state.words.items,
  page: state.words.page,
  fetching: state.words.newWordFetching,
  error: state.words.error,
  word: state.words.word,
  user: state.auth.user,
  allDataRef: state.refs.allDataRef,
  refMap: state.refs.refMap,
});

NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired,
  requestWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord, requestWord, clearNewWordError })(NewWordForm);
