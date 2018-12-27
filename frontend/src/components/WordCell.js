import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import Word from "./Word";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchVisibility } from '../actions/visibilityActions';
import { wordRefToMap } from '../actions/refActions';

class WordCell extends Component {
  constructor(props) { 
    super(props)
    this.showHide = this.showHide.bind(this) 
    this.wordRef = React.createRef();
  }

  static propTypes = {
    element: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const { word, offsetMap } = this.props
    if (offsetMap[word] && this.wordRef.current) {
      console.log(this.wordRef) 
      this.wordRef.current.scrollTop = offsetMap[word]
    }
  }

  componentDidMount() {
    const { word, offsetMap } = this.props
    if (!this.props.refMap[word]) {
      this.props.wordRefToMap(word, this.wordRef);
    }
  }

  showHide(e, word) {
    console.log('changing visibility');
    e.preventDefault();
    this.props.switchVisibility(word);
  }

  render () {
    const { visibilityMap, offsetMap, deleteWord, addRow, element, word } = this.props

    return typeof(element[1]) === 'string' ? (
     <div className="word-cell">
     <Word wordElement={element} visibilityFilter={this.showHide} visibility={visibilityMap[element[1]]} deleteWord={deleteWord} /> 
     </div>
     ) :
     visibilityMap[word] != 'hide' ? 
     <div className="word-cell">
       <div ref={this.wordRef} className="word-about" key={key(element)}><WordTabs word={word} element={element[1]} addRow={addRow} parentRef={this.wordRef}/>
      </div>
    </div> : 
     <div className="word-cell hide-me">
       <div ref={this.wordRef} className="word-about" key={key(element)}><WordTabs word={word} element={element[1]} addRow={addRow} parentRef={this.wordRef} />
      </div>
    </div>  
  }
}

const mapStateToProps = state => ({
  visibilityMap: state.visibility.visibilityMap,
  refMap: state.refs.refMap,
  offsetMap: state.refs.offsetMap
});

export default connect(mapStateToProps, { switchVisibility, wordRefToMap })(WordCell);
