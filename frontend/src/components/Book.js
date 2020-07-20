import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import key from "weak-key";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import DecorateWithLinks from "./DecorateWithLinks";
import { fetchWord, requestWord, clearFetching } from '../actions/wordsActions';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { registerUUId, requestPage, fetchPage } from '../actions/bookActions';
import DictionaryWidget from "./DictionaryWidget";

class Book extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this);
    this.dictionary = this.dictionary.bind(this) 
    this.bookRef = React.createRef();
    this.state = {
      tabIndex: 0,
      bookScrollTop: 0,
    };
  }

  fetchMore = () => {
    const page = this.props.match.params.page
    const what = this.props.match.params.what
    this.props.requestPage(page, what)
    console.log('doing the fetch')
    this.props.fetchPage();
  };
  handleSelect(prev, index, bookRef) {
    console.log('select')
    console.log(prev)
     if (prev == 0) {
       console.log('logging scroll top')
       this.setState( { bookScrollTop: this.bookRef.current.children[0].children[1].children[0].children[0].children[0].scrollTop} );
     }
     else {
     }
     this.setState( { tabIndex: index } );
  }

  static propTypes = {
    page: PropTypes.number.isRequired,
    words: PropTypes.array.isRequired,
    fetchWord: PropTypes.func.isRequired,
    dictionary: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('update')
    const page = this.props.match.params.page
    console.log(this.props.match.params)
    const what = this.props.match.params.what
    console.log(page)
    console.log(this.state.bookScrollTop)
    console.log(this.bookRef.current)
    
    if (this.state.bookScrollTop && this.bookRef.current && this.state.tabIndex == 0 && prevState.tabIndex != 0) {
      bookScrollTop: this.bookRef.current.children[0].children[1].children[0].children[0].children[0].scrollTop = this.state.bookScrollTop;
    }
    
  }
  

  componentDidMount() {
    const { uuid, bookPageMap, what } = this.props
    console.log(this.props)
    const page = this.props.match.params.page
    const whatReq = this.props.match.params.what
    console.log('mounting book');
    console.log('map ', bookPageMap)
    if (uuid)
      this.props.registerUUId(uuid)
    this.props.requestPage(page, what);
    if (whatReq != what) {
      this.props.requestPage(page, whatReq);
      this.props.fetchPage();
    }
    else if (!(bookPageMap[page]) || (bookPageMap[page]['end'] >= 1)) {
      this.props.fetchPage(1)
    }
  }

  dictionary(e, word) {
    e.preventDefault();
    console.log('dictionary')
    console.log('logging scroll top')
    this.setState( { bookScrollTop: this.bookRef.current.children[0].children[1].children[0].children[0].children[0].scrollTop} );
    const { words } = this.props
    const wordElementIndex = words.findIndex(w => w.word == word);
    console.log(wordElementIndex)
      this.props.requestWord(word)
    if (wordElementIndex < 0) { 
      console.log('looking up')
      this.props.fetchWord(word).then(() => {
        console.log(this.props.words)
        this.props.clearFetching()
        this.setState( { tabIndex: 1 } );
      })
    }
    else {

        this.setState( { tabIndex: 1 } );
    }
  }

  render () {
    const { word, words, bookPageMap, ps } = this.props;
    const page = this.props.match.params.page
    const what = this.props.match.params.what

    console.log('render')
    console.log(page)
    const psToShow = bookPageMap[page] ? bookPageMap[page]['psToShow'] : []

    const end = bookPageMap[page] ? bookPageMap[page]['end'] : 0
    const newPage = parseInt(page) + 1

    const wordElementIndex = words.findIndex(w => w.word == word);
    const displayWord = words[wordElementIndex] ? words[wordElementIndex] : words[0]

    return (
    <div className="book" ref={this.bookRef}>
    <Tabs selectedIndex={this.state.tabIndex} onSelect={(prev, index) => this.handleSelect(index, prev, this.bookRef)}>
    <TabList className="react-tabs__tab-list book-tabs">
    <Tab>Book</Tab>
    { words.length ? <Tab>Dictionary</Tab> : '' }
          </TabList>
          <TabPanel className="react-tabs__tab-panel book-tab-panel">
    <div className="book-page">
        <InfiniteScroll
          dataLength={psToShow.length}
          next={this.fetchMore}
          hasMore={ps.length > end}
          height={500}
          loader={<h4>Loading...</h4>}
          endMessage={
           <Link className="is-link" to={`/book/${what}/${newPage}`}>Chapter {newPage}</Link>  
           }
        >
          { psToShow.map(p => <DecorateWithLinks words={p} onLinkClick={this.dictionary} />) }
        </InfiniteScroll>
      </div>
          </TabPanel>
          { words.length ? 
          <TabPanel className="react-tabs__tab-panel book-tab-panel"><DictionaryWidget redirect={0} /></TabPanel> : '' 
          }
          </Tabs>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  words: state.words.words,
  word: state.words.word,
  uuid: state.collections.uuid,
  ps: state.book.ps,
  pageFetching: state.book.pageFetching,
  page: state.book.page,
  what: state.book.what,
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
