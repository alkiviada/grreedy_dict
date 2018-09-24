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
    const { word, collocs, fn, fetchingMap } = props;
    const wordCollocs = collocs[word];
    if (fetchingMap[word]) {
      return (
        <div className="container">
          <div className="notification" className="clear-notification-message">
            Loading...
          </div>
        </div>
      )
    }
    return wordCollocs['error'] ? ( 
      <div className="container">
      <div className="notification" className="clear-notification-trans-warn">
        No collocations
      </div>
      </div>
    ) : 
    ( wordCollocs.map(e => { 
         const new_el = {'expression': e['expression'], 'trans': [ { 'trans': e['translation'], } ]}
        if (e['example']) {
          new_el['trans'][0]['exmpl'] = [{'exmpl': e['example']}]
        }
        return (
         <ul className="etym-style">
         { renderList([new_el], fn[0], listStyles, 0) }
        </ul>)})
    );
}

Collocations.propTypes = {
  word: PropTypes.string.isRequired,
  collocs: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
  fn: PropTypes.func.isRequired,
};  
    
export default connect(mapStateToProps)(Collocations);
