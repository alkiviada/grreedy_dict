import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  pronunciations: state.pronounce.allPronunciations,
  fetchingMap: state.pronounce.fetchingMap,
});

const Pronunciation = (props) => {
    const { word, pronunciations, fetchingMap } = props;
    const wordPronounce = pronunciations[word];
    if (fetchingMap[word]) {
      return (
          <div className="clear-notification-message">
            <em>Loading...</em>
          </div>
      )
    }
    return wordPronounce['error'] || !wordPronounce.reduce((havePronounce, e) => { return e.pronounce != '' ? 1 : 0}, 0) ? ( 
      <div className="notify-warn">
        No pronunciation found
      </div>
    ) : 
    (wordPronounce.map(e => e.pronounce ? 
        <div className="etym-style">
        <p className={`heading lang-head lang-${e.language}`}>{e.language}</p>
        {e.pronounce}
        </div> : '') 
    );
}

Pronunciation.propTypes = {
  word: PropTypes.string.isRequired,
  pronunciations: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Pronunciation);
