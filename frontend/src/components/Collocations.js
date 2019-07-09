import React, { Component } from "react";
import PropTypes from "prop-types";
import DecorateWithLinks from "./DecorateWithLinks";
import key from "weak-key";
import { connect } from 'react-redux';
import { renderList, listStyles } from './helpers';

const mapStateToProps = state => ({
  collocs: state.collocations.allCollocations,
  fetchingMap: state.collocations.fetchingMap,
  newTrans: state.collocations.translations,
});

const Collocations = (props) => {
    const { word, collocs, addRow, fetchingMap, parentRef } = props;
    const wordCollocs = collocs[word];
    if (fetchingMap[word]) {
      return (
          <div className="load-notify">Loading... </div>
      )
    }
    return wordCollocs['error'] ? ( 
      <div className="warn-notify">
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
                                 onClick={(i) => addRow(i, e['expression'], word, parentRef)} className="word-link">
                                 {e['expression']}</a></div>) : (
           <ul className="etym-style">
           { renderList([new_el], addRow, parentRef, word, listStyles, 0) }
           </ul>)})
    );
}

Collocations.propTypes = {
  word: PropTypes.string.isRequired,
  collocs: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  addRow: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Collocations);
