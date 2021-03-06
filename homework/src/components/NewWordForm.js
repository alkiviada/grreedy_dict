import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord, requestWord, clearNewWordError } from '../actions/wordsActions';

class NewWordForm extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      word: '',
    };
    this.handleWordChange = this.handleWordChange.bind(this);
    this.onSubmit = this.onSubmitLookUp.bind(this);
  };


  handleWordChange(w) {
   if (this.props.error) {
     this.props.clearNewWordError();
   }
   this.setState({word: w.target.value});
  }

  onSubmitLookUp(e) {
    e.preventDefault();
    const { word } = this.state
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
      { this.props.error ? <div className="grid-warn">Can't load</div> : '' }
    </form> : <div className="new-word"><p className="grid-notification"><em>Loading...</em></p></div>
    );
  }
};

const mapStateToProps = state => ({
  fetching: state.words.wordFetching,
  fetched: state.words.wordFetched,
  error: state.words.error,
  word: state.words.word,
});

NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired,
  requestWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord, 
                                          requestWord, 
                                          clearNewWordError, 
                                        })(NewWordForm);
