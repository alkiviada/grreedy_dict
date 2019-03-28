import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  uuid: state.collections.uuid,
  conjugations: state.conjugate.allConjugations,
  fetchingMap: state.conjugate.fetchingMap,
});

const Conjugate = (props) => {
    const { word, language, conjugations, fetchingMap, uuid } = props;
    const wordConjs = conjugations[word];
    console.log(wordConjs)
    console.log(fetchingMap)
    if (fetchingMap[word]) {
      return (
          <div className="clear-notification-message">
            <em>Loading...</em>
          </div>
      )
    }
    return wordConjs['error'] ? ( 
      <div className="notify-warn">
        No conjugations 
      </div>
    ) : 
    ( 
      wordConjs.map(e => 
        <div className="etym-style">
          <div className="conjugation-head">
            <p className={`heading lang-head lang-${e.language}`}>{e.language}</p> 
            { e.did_book_examples ?
                <a href={`/homework/conjugate/${e.word}/${e.language}/${uuid}`} data-verb-tool-tip="conjugate"
                  target="_blank" className="conjugate-link">
                  <span className="conjugate-invite">practice conjugation</span> 
                </a> : '' 
            }
          </div>
          <div className="conj-wrapper" dangerouslySetInnerHTML={{ __html:e.conjugations}} />
        </div>)
    );
}

Conjugate.propTypes = {
  word: PropTypes.string.isRequired,
  conjugations: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Conjugate);
