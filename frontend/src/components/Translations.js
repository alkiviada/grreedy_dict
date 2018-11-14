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
    const { word, trans, fn, fetchingMap } = props;
    const word_trans = trans[word];
    if (fetchingMap[word]) {
      return (
            <em>Loading...</em>
      )
    }
    return word_trans['error'] ? ( 
      <div className="notify-warn">
        No translation
      </div>
    ) : 
    ( Object.keys(word_trans).map(e =>  
        <div className="etym-style">
        <p className={`heading lang-head lang-${e}`}>{e}</p>
        <DecorateWithLinks words={word_trans[e].join(', ')} onLinkClick={fn}/>
        </div>)
      
    );
}

Translations.propTypes = {
  word: PropTypes.string.isRequired,
  trans: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  fn: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Translations);
