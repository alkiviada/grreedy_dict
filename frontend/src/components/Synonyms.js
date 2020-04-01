import React, { Component } from "react";
import PropTypes from "prop-types";
import DecorateWithLinks from "./DecorateWithLinks";
import key from "weak-key";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  synonyms: state.synonyms.allSynonyms,
  fetchingMap: state.synonyms.fetchingMap,
});

const Synonyms = (props) => {
    const { word, synonyms, addRow, parentRef, fetchingMap } = props;
    const wordSyns = synonyms[word];
    if (fetchingMap[word]) {
      return (
          <div className="load-notify">
            Loading...
          </div>
      )
    }
    return wordSyns['error'] ? ( 
      <div className="warn-notify">
        No synonyms
      </div>
    ) : 
    ( Object.keys(wordSyns).map(e =>  
         <div className="stuff-container">
        <div className="etym-style">
        <p className={`heading lang-head lang-${e}`}>{e}</p>
        <DecorateWithLinks words={wordSyns[e].join(', ')} onLinkClick={addRow} parentRef={parentRef} original={word} />
        </div></div>)
      
    );
}

Synonyms.propTypes = {
  word: PropTypes.string.isRequired,
  synonyms: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  addRow: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Synonyms);
