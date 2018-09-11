import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord, requestWord } from '../actions/wordsActions';

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
   this.setState({word: w.target.value});
  }

  onSubmitLookUp(e) {
    e.preventDefault();
    console.log('looking up');
    console.log(this.props.allWordsMap);
    if (!this.props.allWordsMap[this.state.word]) {
      this.props.requestWord();
      this.props.lookUpWord(this.state.word, this.props.allWords);
    }
    this.setState({word: ''});
  }

  render () {
    const fetching = this.props.fetching;
    console.log('rendering new word form');
    return (
      <div className="new-word word-notification">
      { !fetching ? 
      <form onSubmit={(e) => this.onSubmitLookUp(e)}> 
      { this.props.error ? <div className="clear-notification-warn">  Can't load this word   </div> : '' }
      <div className="field has-addons has-addons-left">
        <p className="control">
        <input className="input" type="text" placeholder="New Word" value={this.state.word} onChange={this.handleWordChange} />
        </p>
        <p className="control">
        <a className="button look-up-btn" onClick={(e) => this.onSubmitLookUp(e)}>
          Look Up
        </a>
        </p>
      </div>
    </form> : '' }
    { this.props.fetching ? <p className="clear-notification-message">Loading...</p> : '' }
    </div>
    );
  }
};

const mapStateToProps = state => ({
  allWordsMap: state.words.allWordsMap,
  allWords: state.words.items,
  fetching: state.words.newWordFetching,
  error: state.words.error,
});

NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired,
  requestWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord, requestWord })(NewWordForm);
