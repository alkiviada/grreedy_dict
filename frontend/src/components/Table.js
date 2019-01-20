import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordCell from "./WordCell";
import WordLabel from "./WordLabel";
import key from "weak-key";
import { connect } from 'react-redux';
import { deleteWord, lookUpWord, fetchWords, requestWords, requestWord, clearFetching } from '../actions/wordsActions';
import { switchVisibility } from '../actions/visibilityActions';
import { logWordDivOffset, setAllDataRef } from '../actions/refActions';
import { scrollToDomRef } from './helpers';
import { Link } from "react-router-dom";
import BodyClassName from 'react-body-classname';


class Table extends Component {
  constructor(props) { 
    super(props)
    this.addRow = this.addRow.bind(this) 
    this.deleteWord = this.deleteWord.bind(this) 
    this.navigateToPage = this.navigateToPage.bind(this) 
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
    this.props.setAllDataRef(this.myRef)
  }

  navigateToPage(e, uuid, page) {
    console.log('new page');
    e.preventDefault();
    console.log(page)
    this.props.fetchWords(uuid, page)
      .then(() => {
        scrollToDomRef(this.myRef, 35)
      })
  }

  addRow (e, word, original, parentRef) {
    console.log('look up');
    e.preventDefault();
    const parentOffset = parentRef.current.scrollTop
    if (parentOffset) {
      this.props.logWordDivOffset(original, parentOffset);
    }

    const { refMap, allWordsMap, uuid, page } = this.props
     
    if (!this.props.allWordsMap[word]) {
      this.props.requestWord();
      this.props.lookUpWord(word, this.props.uuid).then(() => {
        scrollToDomRef(this.myRef, 35)
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
  }

  componentDidUpdate() {
    this.props.setAllDataRef(this.myRef)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newData = nextProps.data
    const oldData = this.props.data 
    if (nextProps.allFetching !== this.props.allFetching && !oldData.length)
      return true 
    if (oldData.length !== newData.length)
      return true;
    for (var i = oldData.length; i--;) {
      if (oldData[i] !== newData[i])
        return true;
    }
    return false 
  }

  deleteWord(e, word) {
    console.log('deleting');
    e.preventDefault();
    this.props.deleteWord(word);
  }

  render () {
    const { data, pagePrev, pageNext, allWordCount, uuid, page } = this.props;

    const allFetching = this.props.allFetching;
    console.log('i am rendering table')
    const collFetching = this.props.collFetching;

    const wordFetching = this.props.newWordFetching;
    if (allFetching || collFetching) {
      console.log('i am fetching words')
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
    <BodyClassName className={data.length < 11 ? 'body-with-image' : ''}>
    <div className="words-container" ref={this.myRef}>
    { wordFetching ? <em>Loading...</em> : '' }
    { pageNext ? <div className="pagination-1">
                 <a className="pagination-a fas fa-chevron-right" onClick={(e) => this.navigateToPage(e, uuid, pageNext)}></a>
                 <a className="pagination-b fas fa-chevron-right" onClick={(e) => this.navigateToPage(e, uuid, pageNext)}></a>
                 </div> : <div className="pagination-1-placeholder"></div> }
    { pagePrev ? <div className="pagination-2">
                 <a className="pagination-a fas fa-chevron-left" onClick={(e) => this.navigateToPage(e, uuid, pagePrev)}></a>
                 <a className="pagination-b fas fa-chevron-left" onClick={(e) => this.navigateToPage(e, uuid, pagePrev)}></a>
                 </div> : <div className="pagination-2-placeholder"></div> }
      <h2 className="coll-title">
        Showing <WordLabel count={data.length} page={page} allCount={allWordCount} /> 
        { allWordCount ? ` out of ${allWordCount} ` : ' ' } 
        <strong>word{data.length > 1 ? 's' : ''}</strong>
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
  pageNext: state.words.pageNext,
  pagePrev: state.words.pagePrev,
  page: state.words.page,
  allWordCount: state.words.allWordCount,
});

export default connect(mapStateToProps, { setAllDataRef, 
                                          deleteWord, 
                                          lookUpWord, 
                                          fetchWords, 
                                          requestWords, 
                                          requestWord, 
                                          clearFetching,
                                          switchVisibility, 
                                          logWordDivOffset  })(Table);
