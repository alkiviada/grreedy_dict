import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  conjugations: state.conjugate.allConjugations,
  fetchingMap: state.conjugate.fetchingMap,
});

const Conjugate = (props) => {
    const { word, conjugations, fetchingMap } = props;
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
     <div className="etym-style"><p className={`heading lang-head lang-${e.language}`}>{e.language}</p> <div className="conj-wrapper" dangerouslySetInnerHTML={{ __html:e.conjugations}} /></div>)
    );
}

Conjugate.propTypes = {
  word: PropTypes.string.isRequired,
  conjugations: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Conjugate);
