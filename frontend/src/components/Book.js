import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import key from "weak-key";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import DecorateWithLinks from "./DecorateWithLinks";
import WordCell from "./WordCell";
import { fetchWord, requestWord, clearFetching } from '../actions/wordsActions';
import { registerUUId, requestPage, fetchPage } from '../actions/bookActions';

class Book extends Component {
  constructor(props) { 
    super(props)
    this.dictionary = this.dictionary.bind(this) 
  }

  fetchMore = () => {
    const page = this.props.match.params.page
    this.props.requestPage(page)
    console.log('doing the fetch')
    this.props.fetchPage();
  };

  static propTypes = {
    page: PropTypes.number.isRequired,
    words: PropTypes.array.isRequired,
    fetchWord: PropTypes.func.isRequired,
    dictionary: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };


  componentDidUpdate() {
    console.log('update')
    const page = this.props.match.params.page
    console.log(page)
    
  }
  

  componentDidMount() {
    const { uuid, bookPageMap } = this.props
    console.log(this.props)
    const page = this.props.match.params.page
    console.log('mounting book');
    console.log('map ', bookPageMap)
    if (uuid)
      this.props.registerUUId(uuid)
    this.props.requestPage(page);
    if (!(bookPageMap[page]) || (bookPageMap[page]['end'] > 2)) {
      this.props.fetchPage(1)
    }
  }

  dictionary(e, word) {
    e.preventDefault();
    console.log('dictionary')
    const { words } = this.props
    const wordElementIndex = words.findIndex(w => w.word == word);
    console.log(wordElementIndex)
      this.props.requestWord(word)
    if (wordElementIndex < 0) { 
      console.log('looking up')
      this.props.fetchWord(word).then(() => {
        console.log(this.props.words)
        this.props.clearFetching()
      })
    }
  }

  render () {
    const { word, words, bookPageMap, ps } = this.props;
    const page = this.props.match.params.page

    console.log('render')
    console.log(page)
    const psToShow = bookPageMap[page] ? bookPageMap[page]['psToShow'] : []
    const end = bookPageMap[page] ? bookPageMap[page]['end'] : 0
    const newPage = parseInt(page) + 1

    const wordElementIndex = words.findIndex(w => w.word == word);
    const displayWord = words[wordElementIndex] ? words[wordElementIndex] : words[0]
    return (
    <div className="book">
    <div className="book-page">
        <InfiniteScroll
          dataLength={psToShow.length}
          next={this.fetchMore}
          hasMore={ps.length > end}
          height={300}
          loader={<h4>Loading...</h4>}
          endMessage={
           <Link className="is-link" to={`/book/${newPage}`}>Chapter {newPage}</Link>  
           }
        >
          { psToShow.map(p => <DecorateWithLinks words={p} onLinkClick={this.dictionary} />) }
        </InfiniteScroll>
      </div>
    { words.length ? 
        <div className="book-dict">
        <div className="words-rows"> {
        Object.entries(displayWord).map(el => <WordCell word={word} element={el} addRow={this.dictionary} />) }
        </div></div> :
        '' 
    }
    </div>
    );
  }
}

const mapStateToProps = state => ({
  words: state.words.items,
  word: state.words.word,
  uuid: state.collections.uuid,
  ps: state.book.ps,
  pageFetching: state.book.pageFetching,
  page: state.book.page,
  bookPageMap: state.book.bookPageMap,
});

export default withRouter(connect(mapStateToProps, { 
  fetchPage, 
  clearFetching,
  requestPage, 
  requestWord, 
  fetchWord, 
  registerUUId 
})(Book));
