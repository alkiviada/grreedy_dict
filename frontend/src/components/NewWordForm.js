import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord, requestWord, clearNewWordError, fetchWords, clearFetched, clearFetching } from '../actions/wordsActions';
import { scrollToDomRef } from './helpers';

class NewWordForm extends Component {
  constructor(props) { 
    super(props)
    this.newWordLabelRef = React.createRef()

    this.state = {
      word: '', 
      nwLabel: 'floating-label',
    };

    this.inputOrLabel = this.inputOrLabel.bind(this) 
    this.hideLabel = this.hideLabel.bind(this) 
    this.showLabel = this.showLabel.bind(this) 
    this.handleWordChange = this.handleWordChange.bind(this);
    this.onSubmit = this.onSubmitLookUp.bind(this);
  };


  componentDidUpdate() {
    const { word, page, fetched, allWordsMap, refMap } = this.props
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

  hideLabel(e, labelRef) {
    const key = labelRef.current.htmlFor 
    this.setState({ nwLabel: 'floating-label top-label' });
  }

  showLabel(e, labelRef) {
    this.setState({ nwLabel: 'floating-label' });
  }

  inputOrLabel(e, labelRef) {
    if (e.target.value == "") {
      this.showLabel(e, labelRef);
    } 
    else if (e.target.value != "") {
      this.hideLabel(e, labelRef);
    }
  }

  onSubmitLookUp(e) {
    e.preventDefault();
    const { word } = this.state
    const { page, allWordsMap, refMap, uuid } = this.props
    if (!allWordsMap[word]) {
      console.log('ive never seen this word')
      this.props.requestWord(word);
      this.props.lookUpWord(word, uuid).then(() => {
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
    const opened = this.props.menuOpen
    console.log(opened)
    if (opened)
      return ''

    const { fetching, error } = this.props;

    console.log('this is my errror ', error)

    const word = !this.props.error ? this.state.word : this.props.word
    const nwLabel = error ? 'floating-label top-label error' : word ? 'floating-label top-label' : 'floating-label'
    const nwClass = error ? 'new-word-input error' : 'new-word-input'
    const nwLabelText = error ? "Cant' find word" : 'New Word'
    console.log('rendering new word form');
    return (
      !fetching ? 
      <form className="new-word" onSubmit={(e) => this.onSubmitLookUp(e)}> 
       <div className="input-form-wrapper">
        <label className={nwLabel} htmlFor="new-word" ref={this.newWordLabelRef}>{nwLabelText}</label>
        <input className={nwClass} onFocus={(e) => this.hideLabel(e, this.newWordLabelRef)} onInput={(e) => this.inputOrLabel(e, this.newWordLabelRef)} onBlur={(e) => this.inputOrLabel(e, this.newWordLabelRef)} type="text" value={word} onChange={this.handleWordChange} id="new-word" />
    <button className="look-up-button">
    <svg     
      xmlns="http://www.w3.org/2000/svg"    
      version="1.1"
      className="look-up-svg-container"
      viewBox="-2 2.3 11.2 10.4" width="100%" height="100%">
<defs>
</defs>
<g transform="rotate(25)" className="look-up-svg">
<circle cx="5" cy="5" r="4" />
<line x1="9" y1="6" x2="13" y2="7.5" />
</g>
</svg>
</button>
</div>
      { this.props.error ? '' : '' }
    </form> : 
    <div className="new-word"><p className="grid-notification"><em>Loading...</em></p></div>
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
  menuOpen: state.context.menuOpen,
});

NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired,
  requestWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord, requestWord, clearNewWordError, fetchWords, clearFetched, clearFetching })(NewWordForm);
