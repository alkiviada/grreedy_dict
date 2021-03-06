import React, { Component } from "react";
import PropTypes from "prop-types";
import DecorateWithLinks from "./DecorateWithLinks";
import key from "weak-key";
import { connect } from 'react-redux';
import { renderList, listStyles } from './helpers';

const mapStateToProps = state => ({
  collocs: state.collocations.allCollocations,
  fetchingMap: state.collocations.fetchingMap,
});

const Collocations = (props) => {
    const { word, collocs, addWord, fetchingMap } = props;
    const wordCollocs = collocs[word];
    if (fetchingMap[word]) {
      return (
          <div className="clear-notification-message">
            <em>Loading...</em>
        </div>
      )
    }
    return wordCollocs['error'] ? ( 
      <div className="notify-warn">
        No collocations
      </div>
    ) : 
    ( wordCollocs.map(e => { 
         const new_el = {'expression': e['expression'] }  
         const isEnglishWord = e['translation'] ? 0 : 1
         if (!isEnglishWord) {
           new_el['trans'] = [ { 'trans': e['translation'], } ]
         }

         if (e['example']) {
           new_el['trans'][0]['exmpl'] = [{'exmpl': e['example']}]
         }
         return isEnglishWord ? (<div className="etym-style"><a target="_blank" href={`/api/word/${e['expression']}`}
                                 onClick={(i) => addWord(i, e['expression'])} className="word-link">
                                 {e['expression']}</a></div>) : (
           <ul className="etym-style">
           { renderList([new_el], addWord, listStyles, 0) }
           </ul>)})
    );
}

Collocations.propTypes = {
  word: PropTypes.string.isRequired,
  collocs: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Collocations);
