import React, { Component } from "react";
import { connect } from 'react-redux';

import { prons } from './helpers'

class CheckConjugate extends Component {
  constructor(props) { 
    super(props)
  }

  render () {
    const { myConjugs, fetching, correctConjugs } = this.props
    console.log(correctConjugs)
    console.log(myConjugs)
    if (fetching) {
      return (
        <div className="clear-notification-message">
          <em>Loading...</em>
        </div>
      )
    }
    return <div className="chk-conjugate">
    { prons.map((p, i) => 
       <div className="who-conjugate">
         <div className="who">{p}</div>
         <div className="correct">
        { !myConjugs[i] ? <div className="right-answer">{correctConjugs[i]}</div> : 
            myConjugs[i] == correctConjugs[i] ? myConjugs[i] : 
            <div className="corrections">
            <div className="wrong-answer">{myConjugs[i]}</div>
            <div className="correct-answer">{correctConjugs[i]}</div>
            </div>
        } 
         </div>
       </div>
     )}
    </div>
  }
}

const mapStateToProps = state => ({
  fetching: state.conjugs.conjugsFetching, 
  correctConjugs: state.conjugs.correctConjugs, 
  myConjugs: state.conjugs.myConjugs, 
});

export default connect(mapStateToProps, { })(CheckConjugate);
