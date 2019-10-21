import React, { Component } from "react";
import DecorateWithLinks from "./DecorateWithLinks";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { renderList, listStyles } from './helpers';

const mapStateToProps = state => ({
  uuid: state.collections.uuid,
  corpora: state.corpora.allCorpora,
  fetchingMap: state.corpora.fetchingMap,
});

const Corpora = (props) => {
    const { word, corpora, addRow, parentRef, fetchingMap, uuid } = props;
    const wordCorp = corpora[word];
    console.log(wordCorp)
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
           <ul className="corpora-style"> {
      wordCorp.map(e => 
        <li><DecorateWithLinks words={e.example} onLinkClick={addRow} original={word} parentRef={parentRef} /></li>
        )
           }
     </ul>
    );
}

Corpora.propTypes = {
  word: PropTypes.string.isRequired,
  corpora: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Corpora);
