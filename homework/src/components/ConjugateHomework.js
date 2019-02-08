import React, { Component } from "react";
import ProcessPlaceholder from "./ProcessPlaceholder";
import { connect } from 'react-redux';

class ConjugateHomework extends Component {
  constructor(props) { 
    super(props)
    console.log(props)
  }

  render () {
    const { homework, hRefs } = this.props
    console.log(hRefs)
    if (!homework.length) {
      return (
        <div className="clear-notification-message">
          <em>Loading...</em>
        </div>
      )
    }
    return <div className="hconjugate">
      { homework.map((h,i) => { console.log(hRefs[i]); return <ProcessPlaceholder homework={h} pref={hRefs[i]} />}) }
    </div>
  }
}

const mapStateToProps = state => ({
  homework: state.conjugsHomework.homework,
  hRefs: state.conjugsHomework.myConjugsRefs,
});

export default connect(mapStateToProps, { })(ConjugateHomework);
