import React, { Component } from "react";
import PropTypes from "prop-types";
import DecorateWithLinks from "./DecorateWithLinks";
import key from "weak-key";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  trans: state.translations.allTranslations,
  fetchingMap: state.translations.fetchingMap,
});

const Translations = (props) => {
    const { word, trans, addToDict, fetchingMap, parentRef } = props;
    const word_trans = trans[word];
    if (fetchingMap[word]) {
      return (
          <div className="load-notify">
            Loading...
          </div>
      )
    }
    return word_trans['error'] ? ( 
      <div className="warn-notify">
        No translation
      </div>
    ) : 
    ( Object.keys(word_trans).map(e =>  
        <div className="etym-style">
        <p className={`heading lang-head lang-${e}`}>{e}</p>
        <DecorateWithLinks words={word_trans[e].join(', ')} onLinkClick={addToDict} original={word} parentRef={parentRef} />
        </div>)
      
    );
}

Translations.propTypes = {
  word: PropTypes.string.isRequired,
  trans: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  addToRow: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Translations);
