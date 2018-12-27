import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordCell from "./WordCell";
import key from "weak-key";
import { connect } from 'react-redux';
import { deleteWord, lookUpWord, fetchWords, requestWords, requestWord } from '../actions/wordsActions';
import { switchVisibility } from '../actions/visibilityActions';
import { logWordDivOffset } from '../actions/refActions';
import { Link } from "react-router-dom";
import BodyClassName from 'react-body-classname';


class Table extends Component {
  constructor(props) { 
    super(props)
    this.addRow = this.addRow.bind(this) 
    this.deleteWord = this.deleteWord.bind(this) 
    this.myRef = React.createRef();
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    lookUpWord: PropTypes.func.isRequired,
    deleteWord: PropTypes.func.isRequired,
    switchVisibility: PropTypes.func.isRequired,
    fetchWords: PropTypes.func.isRequired,
    requestWords: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };

  componentDidMount() {
    console.log('mounting table');
    if (!this.props.data) {
      this.props.requestWords();
      this.props.fetchWords(this.props.uuid);
    }
  }

  addRow (e, word, original, parentRef) {
    console.log('look up');
    e.preventDefault();
    const parentOffset = parentRef.current.scrollTop
    if (parentOffset) {
      this.props.logWordDivOffset(original, parentOffset);
    }
     
    if (!this.props.allWordsMap[word]) {
      this.props.lookUpWord(word, this.props.uuid);
      this.scrollToDomRef(this.myRef, 35)
    }
    else if (this.props.refMap[word] && this.props.refMap[word].current) {
      console.log('i am here will scroll to exisitng')
      this.scrollToDomRef(this.props.refMap[word], 80)
    }
  }

  deleteWord(e, word) {
    console.log('deleting');
    e.preventDefault();
    this.props.deleteWord(word);
  }

  scrollToDomRef = (ref, offset) => {
    const domNode = ReactDOM.findDOMNode(ref.current)
    window.scrollTo(0, domNode.offsetTop-offset)
  }

  render () {
    const data = this.props.data;

    const allFetching = this.props.allFetching;
    const collFetching = this.props.collFetching;

    const wordFetching = this.props.newWordFetching;
    if (allFetching || collFetching) {
      return (
        <BodyClassName className="body-with-image">
        <div className="words-container">
        <em>Loading...</em> 
        </div>
        </BodyClassName>
      )
    } 
    const auth = this.props.auth
    return !data.length ? (
      <BodyClassName className="body-with-image">
      <div className="words-container" ref={this.myRef}>
      <div className="words-invite">
      Start new collection
      { !auth.isAuthenticated ? 
          <span> or <Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link></span> : '' }
      </div>
      </div>
      </BodyClassName>
    ) : (
    <BodyClassName className={data.length < 6 ? 'body-with-image' : ''}>
    <div className="words-container" ref={this.myRef}>
    { wordFetching ? <em>Loading...</em> : '' }
      <h2 className="coll-title">
        Showing <strong>{data.length} word{data.length > 1 ? 's' : ''}</strong>
      </h2>
      <div className="words-table">
       <div className="words-head">
            {Object.entries(data[0]).map((el, i) => <p>{el[0]}</p>)}
        </div>
        <div className="words-rows">
          {data.map(el => {
            let word = el.word;
            return (
              Object.entries(el).map(el => <WordCell word={word} element={el} addRow={this.addRow} deleteWord={this.deleteWord} />)
            )
          })}
        </div>
      </div>
    </div>
    </BodyClassName>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  refMap: state.refs.refMap,
  uuid: state.collections.uuid,
  data: state.words.items,
  allWordsMap: state.words.allWordsMap,
  allFetching: state.words.allWordsFetching,
  collFetching: state.collections.fetching,
  wordFetching: state.words.newWordFetching,
});

export default connect(mapStateToProps, { deleteWord, lookUpWord, fetchWords, requestWords, requestWord, switchVisibility, logWordDivOffset  })(Table);
