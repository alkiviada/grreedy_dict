import * as appActions from '../actions/actions';

import Highlightable from 'highlightable';
import RaisedButton  from 'material-ui/RaisedButton';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import React, { Component, PropTypes } from 'react';
import { Map , List, is, fromJS } from 'immutable';
import { connect } from 'react-redux';

class HighlightWord extends Component {
  constructor(props) {
    super(props);
  }

  onTextHighlighted(range) {
    this.props.highlightRange(range);
    window.getSelection().removeAllRanges();
  }

  tooltipRenderer(lettersNode, range, rangeIndex, onMouseOverHighlightedWord) {
      return (<Tooltip key={`${range.data.id}-${rangeIndex}`} onVisibleChange={onMouseOverHighlightedWord.bind(this, range)}
                          placement="top"
                          overlay={<div><RaisedButton label={'Reset highlights'} onClick={this.resetHightlight.bind(this, range)} /></div>}
                          defaultVisible={true}
                          animation="zoom">
          <span>{lettersNode}</span>
      </Tooltip>);
  }

  customRenderer(currentRenderedNodes, currentRenderedRange, currentRenderedIndex, onMouseOverHighlightedWord) {
    return this.tooltipRenderer(currentRenderedNodes, currentRenderedRange, currentRenderedIndex, onMouseOverHighlightedWord);
  }

  resetHightlight(range) {
    this.props.removeHighlightRange(range);
  }

  render() {
    return (
          <div>
          <Highlightable ranges={this.props.ranges.get(this.props.id, new List()).toJS()}
                 enabled={true}
                 style={{textAlign: 'left'}}
                 onTextHighlighted={this.onTextHighlighted.bind(this)}
                 id={this.props.id}
                 highlightStyle={{
                   backgroundColor: 'black'
                 }}
                 rangeRenderer={this.customRenderer.bind(this)}
                 text={this.props.words}
          />
         </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ranges: state.app.get('ranges', new Map())
  };
}

function mapDispatchToProps(dispatch) {
  return {
    highlightRange: range => dispatch(appActions.highlightRange(range)),
    removeHighlightRange: range => dispatch(appActions.removeHighlightRange(range))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightWord);
