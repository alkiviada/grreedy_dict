import React, { Component } from "react";
import PropTypes from "prop-types";
import DecorateWithLinks from "./DecorateWithLinks";
import key from "weak-key";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  trans: state.words.allTranslations,
  fetching: state.words.fetching,
  newTrans: state.words.translations,
});

const Translations = (props) => {
    const { word, trans, fn, fetching } = props;
    const word_trans = trans[word];
    if (fetching) {
      return (
        <div className="container">
          <div className="notification" className="clear-notification">
            Loading...
          </div>
        </div>
      )
    }
    return !word_trans || !Object.keys(word_trans).length ? ( 
      <div className="container">
      <div className="notification" className="clearNotification">
        Nothing to show
      </div>
      </div>
    ) : 
    ( Object.keys(word_trans).map(e =>  
        <div className="etym-style">
        <p style={fontStylesForLang[e]} className="heading lang-head">{e}</p>
        <DecorateWithLinks words={word_trans[e].join(', ')} onLinkClick={fn}/>
        </div>)
      
    );
}

const fontStylesForLang =  {
 'french': {'fontFamily': 'Parisienne', 'color': '#c18eda'},
 'italian': {'fontFamily': 'Italiana', 'color': '#2e8286'},
 'english': {'fontFamily': 'IM Fell English SC', 'color': '#6c8dbc'},
}

export default connect(mapStateToProps)(Translations);
