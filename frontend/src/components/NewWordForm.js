import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord, requestWord, clearNewWordError, fetchWords, clearFetched, clearFetching } from '../actions/wordsActions';
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
    const { word, page, fetched, allWordsMap, refMap } = this.props
    console.log(fetched)
    if (refMap[word] && refMap[word].current && fetched) {
      scrollToDomRef(refMap[word], 80)
      this.props.clearFetched()
    }
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
    const { page, allWordsMap, refMap, uuid } = this.props
    if (!allWordsMap[word]) {
      console.log('ive never seen this word')
      this.props.requestWord(word);
      this.props.lookUpWord(word, uuid).then(() => {
        console.log(refMap[word])
        console.log('strange')
      })
    }
    else {
      console.log('i am here will scroll to exisitng')
      if (allWordsMap[word] != page) {
        console.log('i used to see this word but elsewhere')
        this.props.requestWord(word);
        this.props.fetchWords(uuid, allWordsMap[word]).then(() => {
          this.props.clearFetching()
        })
      }
      else if (refMap[word]) {
        this.props.requestWord(word);
        scrollToDomRef(refMap[word], 80)
        this.props.clearFetching()
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
  fetching: state.words.newWordFetching,
  fetched: state.words.newWordFetched,
  error: state.words.error,
  word: state.words.word,
  page: state.words.page,
  user: state.auth.user,
  allDataRef: state.refs.allDataRef,
  refMap: state.refs.refMap,
});

NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired,
  requestWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord, requestWord, clearNewWordError, fetchWords, clearFetched, clearFetching })(NewWordForm);
