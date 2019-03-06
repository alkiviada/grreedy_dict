import React, { Component } from "react";
import Placeholder from "./Placeholder";
import { connect } from 'react-redux';
import { storeMyConjugateRefs } from '../actions/conjugsActions';

import { prons } from './helpers'

class JustConjugate extends Component {
  constructor(props) { 
    super(props)
    this.jconjRefMap = prons[props.language].reduce((map, p) => (map[p] = React.createRef(), map), {});
  }

  componentDidMount() {
    this.props.storeMyConjugateRefs(this.jconjRefMap, this.props.language)
  }

  render () {
    return <div className="jconjugate">
    { prons[this.props.language].map(p => 
       <div className="who-conjugate">
         <div className="who">{p}</div>
         <Placeholder classStyle="my-conjugate-verb" pref={this.props.myConjugsRefMap[p]} />
       </div>
     )}
    </div>
  }
}

const mapStateToProps = state => ({
  myConjugsRefMap: state.conjugs.myConjugsRefMap,
});

export default connect(mapStateToProps, { storeMyConjugateRefs })(JustConjugate);
