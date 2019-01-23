import React, { Component } from "react";
import Placeholder from "./Placeholder";
import { connect } from 'react-redux';
import { storeMyConjugateRefs } from '../actions/conjugsActions';

import { prons } from './helpers'

class JustConjugate extends Component {
  constructor(props) { 
    super(props)
    this.jconjRefMap = prons.reduce((map, p) => (map[p] = React.createRef(), map), {});
  }

  componentDidMount() {
    console.log('registering conjugate refs');
    this.props.storeMyConjugateRefs(this.jconjRefMap)
  }

  render () {
    console.log(this.props.myConjugsRefMap)
    return <div ref={this.jconjRef} className="jconjugate">
    { prons.map(p => 
       <div className="who-conjugate">
         <div className="who">{p}</div>
         <Placeholder pref={this.props.myConjugsRefMap[p]} />
       </div>
     )}
    </div>
  }
}

const mapStateToProps = state => ({
  myConjugsRefMap: state.conjugs.myConjugsRefMap,
});

export default connect(mapStateToProps, { storeMyConjugateRefs })(JustConjugate);
