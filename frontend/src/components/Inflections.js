import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  uuid: state.collections.uuid,
  inflections: state.inflections.allInflections,
  fetchingMap: state.inflections.fetchingMap,
});

const Inflections = (props) => {
    const { word, language, inflections, fetchingMap, uuid } = props;
    const wordInfls = inflections[word];
    console.log(wordInfls)
    console.log(fetchingMap)
    if (fetchingMap[word]) {
      return (
          <div className="load-notify">
            Loading...
          </div>
      )
    }
    return wordInfls['error'] ? ( 
      <div className="warn-notify">
        No inflections
      </div>
    ) : 
    ( 
      wordInfls.map(e => 
        <ul className="etym-style">
         
        { e['inflections'].split(',').map(i => <li>{i}</li>) }
        </ul>)
    );
}

Inflections.propTypes = {
  word: PropTypes.string.isRequired,
  inflections: PropTypes.object.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(Inflections);
