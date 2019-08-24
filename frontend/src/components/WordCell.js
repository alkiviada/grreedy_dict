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
    const { word, offsetMap, tabIndexMap } = this.props
    if (offsetMap[word] && this.wordRef.current && [0,1,2].filter(i => i == tabIndexMap[word]).length) {
      this.wordRef.current.scrollTop = offsetMap[word]
    }
    this.props.wordRefToMap(word, this.wordRef);
  }

  componentDidMount() {
    const { word } = this.props
    this.props.wordRefToMap(word, this.wordRef);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps 

    if (nextProps.word == this.props.word && (nextProps.visibilityMap[word] == this.props.visibilityMap[word]) && (nextProps.refMap[word] && (nextProps.refMap[word] == this.props.refMap[word])) && (nextProps.tabIndexMap[word] == this.props.tabIndexMap[word])) {
      return 0
    }
    else {
      return 1
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
  offsetMap: state.refs.offsetMap,
  tabIndexMap: state.tabs.mapTabIndex,
});

export default connect(mapStateToProps, { switchVisibility, wordRefToMap })(WordCell);
