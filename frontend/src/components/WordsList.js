import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordBare from "./WordBare";
import WordLabel from "./WordLabel";
import { connect } from 'react-redux';
import { closeMenu } from '../actions/contextActions';
import { 
         deleteWord, 
         lookUpWord, fetchWords, requestWords, requestWord, 
         clearFetched,
         clearFetching } from '../actions/wordsActions';
import { logWordDivOffset, setAllDataRef } from '../actions/refActions';
import { scrollToDomRef } from './helpers';
import { Link, withRouter } from "react-router-dom";
import BodyClassName from 'react-body-classname';


class WordsList extends Component {
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
    requestWords: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let { page, page_id } = this.props; 
    page_id = page_id ? page_id : 1
    console.log(this.props)
    if ((!this.props.data.length && this.props.uuid) || (page_id && (page_id != page))) {
      this.props.requestWords();
        console.log('mounting')
        console.log(this.props)
      this.props.fetchWords(this.props.uuid, page_id).then(() => {
        console.log('fetchwords returned')
      })
    }
    this.props.setAllDataRef(this.myRef)
  }

  navigateToPage(e, uuid, page) {
    e.preventDefault();
    this.props.fetchWords(uuid, page)
      .then(() => {
        scrollToDomRef(this.myRef, 35)
      })
  }


  addRow (e, word, original, parentRef) {
    e.preventDefault();
    const opened = this.props.menuOpen
    if (opened) 
      this.props.closeMenu() 
    const parentOffset = parentRef.current.offsetTop
    if (parentOffset) {
      this.props.logWordDivOffset(original, parentOffset);
    }

    const { refMap, allWordsMap, uuid, page } = this.props
     
    if (!this.props.allWordsMap[word]) {
      this.props.requestWord(word);
      this.props.lookUpWord(word, this.props.uuid).then(() => {
      })
    }
    else {
      if (allWordsMap[word] != page) {
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
    const { word, page, fetched, allWordsMap, refMap } = this.props
    if (refMap[word] && refMap[word].current && fetched) {
      scrollToDomRef(refMap[word], 80)
      this.props.clearFetched()
    }
    this.props.setAllDataRef(this.myRef)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newData = nextProps.data
    const oldData = this.props.data 
    if (nextProps.allFetching !== this.props.allFetching && !oldData.length)
      return true 
    if (nextProps.auth.isAuthenticated !== this.props.auth.isAuthenticated)
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
    e.preventDefault();
    this.props.deleteWord(word);
  }

  render () {
    const { data, pagePrev, pageNext, allWordCount, uuid, page } = this.props;
    console.log(this.props)

    const allFetching = this.props.allFetching;
    const collFetching = this.props.collFetching;

    const wordFetching = this.props.newWordFetching;
    if (allFetching || collFetching) {
      return (
        <BodyClassName className="body-with-image">
        <div className="words-container">
        <div className="load-notify">Loading...</div> 
        </div>
        </BodyClassName>
      )
    } 
    const auth = this.props.auth
    console.log('this is the data i have')
    console.log(data);
    let idx = 0;
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
    { wordFetching ? <div className="load-notify">Loading...</div> : '' }
    { pageNext ? <div className="pagination-1">
                 <button className="pagination-a" onClick={(e) => this.navigateToPage(e, uuid, pageNext)}>&#9654;</button>
                 <button className="pagination-b" onClick={(e) => this.navigateToPage(e, uuid, pageNext)}>&#9654;</button>
                 </div> : pagePrev ? <div className="pagination-1-placeholder"></div> : '' }
    { pagePrev ? <div className="pagination-2">
                 <button className="pagination-a" onClick={(e) => this.navigateToPage(e, uuid, pagePrev)}>&#9664;</button>
                 <button className="pagination-b" onClick={(e) => this.navigateToPage(e, uuid, pagePrev)}>&#9664;</button>
                 </div> : pageNext ? <div className="pagination-2-placeholder"></div> : '' }
      <h2 className="coll-title">
        Showing <WordLabel count={data.length} page={page} allCount={allWordCount} /> 
        { allWordCount ? ` out of ${allWordCount} ` : ' ' } 
        <strong>word{data.length > 1 ? 's' : ''}</strong>
      </h2>
        <ul className="words-list">
          {data.map(w => {
            idx++;
            console.log('haha')
            return <WordBare word={w} deleteWord={this.deleteWord} key={idx} /> 
          })}
        </ul>
      </div>
    </BodyClassName>
    );
  }
}

const mapStateToProps = state => ({
  menuOpen: state.context.menuOpen,
  auth: state.auth,
  refMap: state.refs.refMap,
  uuid: state.collections.uuid,
  data: state.collections.collWords,
  allWordsMap: state.words.allWordsMap,
  allFetching: state.words.allWordsFetching,
  collFetching: state.collections.fetching,
  wordFetching: state.words.newWordFetching,
  fetched: state.words.newWordFetched,
  pageNext: state.words.pageNext,
  pagePrev: state.words.pagePrev,
  page: state.words.page,
  allWordCount: state.words.allWordCount,
});

export default withRouter(connect(mapStateToProps, { setAllDataRef, 
                                          closeMenu,
                                          deleteWord, 
                                          lookUpWord, 
                                          fetchWords, 
                                          requestWords, 
                                          requestWord, 
                                          clearFetching,
                                          clearFetched,
                                          logWordDivOffset  })(WordsList));
