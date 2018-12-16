import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import Word from "./Word";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchVisibility } from '../actions/visibilityActions';

class WordCell extends Component {
  constructor(props) { 
    super(props)
    this.showHide = this.showHide.bind(this) 
  }

  static propTypes = {
    element: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
  };

  showHide(e, word) {
    console.log('changing visibility');
    e.preventDefault();
    this.props.switchVisibility(word);
  }

  render () {
    const { visibilityMap, deleteWord, addRow, element, word } = this.props

    return typeof(element[1]) === 'string' ? (
     <div className="word-cell">
     <Word wordElement={element} visibilityFilter={this.showHide} visibility={visibilityMap[element[1]]} deleteWord={deleteWord} /> 
     </div>
     ) :
     visibilityMap[word] != 'hide' ? 
     <div className="word-cell">
       <div className="word-about" key={key(element)}><WordTabs word={word} element={element[1]} addRow={addRow} />
      </div>
    </div> : 
     <div className="word-cell hide-me">
       <div className="word-about" key={key(element)}><WordTabs word={word} element={element[1]} addRow={addRow} />
      </div>
    </div>  
  }
}

const mapStateToProps = state => ({
  visibilityMap: state.visibility.visibilityMap
});

export default connect(mapStateToProps, { switchVisibility })(WordCell);
