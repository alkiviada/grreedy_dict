import React, { Component } from "react";
import ProcessCorrect from "./ProcessCorrect";
import { connect } from 'react-redux';

let classNames = require('classnames');

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
      { homework.map((h,i) => { 
          const hweClassNames = classNames({ 'homework-example': true, 'hw-example-wrong': correct[i] != myConjugs[i] ? true : false });
          console.log(hweClassNames, correct[i], myConjugs[i])
          return <div className={hweClassNames}><ProcessCorrect homework={h} correct={correct[i]} answer={myConjugs[i]} /></div>
        })
      }
    </div>
  }
}

const mapStateToProps = state => ({
  homework: state.conjugsHomework.homework,
  correct: state.conjugsHomework.correct,
  myConjugs: state.conjugsHomework.myConjugs,
});

export default connect(mapStateToProps, {  })(ConjugateHomeworkCheck);
