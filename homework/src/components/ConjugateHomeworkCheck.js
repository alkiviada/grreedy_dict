import React, { Component } from "react";
import ProcessCorrect from "./ProcessCorrect";
import { connect } from 'react-redux';

class ConjugateHomeworkCheck extends Component {
  constructor(props) { 
    super(props)
  }

  componentDidMount() {
  }

  render () {
    const { homework, correct, myConjugs } = this.props
    console.log(myConjugs)
    console.log(correct)
    return <div className="hconjugate">
      { homework.map((h,i) => <ProcessCorrect homework={h} correct={correct[i]} answer={myConjugs[i]} />) }
    </div>
  }
}

const mapStateToProps = state => ({
  homework: state.conjugsHomework.homework,
  correct: state.conjugsHomework.correct,
  myConjugs: state.conjugsHomework.myConjugs,
});

export default connect(mapStateToProps, {  })(ConjugateHomeworkCheck);
