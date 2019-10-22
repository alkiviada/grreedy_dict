import React, { Component } from "react";
import DecorateWithLinks from "./DecorateWithLinks";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from 'react-redux';
import { fetchCorpora } from '../actions/corporaActions';

const mapStateToProps = state => ({
  uuid: state.collections.uuid,
  corpora: state.corpora.allCorpora,
  end: state.corpora.end,
  oldIds: state.corpora.oldIds,
  fetchingMap: state.corpora.fetchingMap,
});

class Corpora extends React.Component {
  constructor(props) { 
    super(props)
  }

  fetchMoreCorpora = () => {
    console.log('doing the fetch')
    const { corpora, word } = this.props
    const oldIds = corpora[word].map(e => e.pk).join(',');
    console.log(oldIds)
    this.props.fetchCorpora(word, oldIds);
  };

  render() {
    const { word, end, corpora, addRow, parentRef, fetchingMap, uuid } = this.props;
    console.log('my end: ', end)
    const wordCorp = corpora[word] ? corpora[word] : [];
    console.log(wordCorp)
    console.log(wordCorp.length)
    console.log(fetchingMap)
    if (fetchingMap[word]) {
      return (
          <div className="load-notify">
            Loading...
          </div>
      )
    }
    return wordCorp['error'] ? ( 
      <div className="warn-notify">
        No corpora
      </div>
    ) : 
    !wordCorp.length ? ( 
      <div className="warn-notify">
        No corpora
      </div>) :
    ( 
        <InfiniteScroll
          dataLength={wordCorp.length}
          next={this.fetchMoreCorpora}
          hasMore={!end}
          height={200}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>}
        >
           <ul className="corpora-style"> {
      wordCorp.map(e => 
        <li><DecorateWithLinks words={e.example} onLinkClick={addRow} original={word} parentRef={parentRef} /></li>
        )
           }
     </ul>
        </InfiniteScroll>
    );
  }
}

Corpora.propTypes = {
  word: PropTypes.string.isRequired,
  corpora: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps, { fetchCorpora })(Corpora);
