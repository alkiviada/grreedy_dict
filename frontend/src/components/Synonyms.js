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
    const { word, synonyms, fn, fetchingMap } = props;
    console.log(synonyms)
    console.log(word)
    console.log(fetchingMap)
    const wordSyns = synonyms[word];
    if (fetchingMap[word]) {
      return (
            <em>Loading...</em>
      )
    }
    return wordSyns['error'] ? ( 
      <div className="notify-warn">
        No synonyms
      </div>
    ) : 
    ( Object.keys(wordSyns).map(e =>  
        <div className="etym-style">
        <p className={`heading lang-head lang-${e}`}>{e}</p>
        <DecorateWithLinks words={wordSyns[e].join(', ')} onLinkClick={fn}/>
        </div>)
      
    );
}

Synonyms.propTypes = {
  word: PropTypes.string.isRequired,
  synonyms: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  fn: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Synonyms);
