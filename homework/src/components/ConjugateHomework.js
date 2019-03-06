import React, { Component } from "react";
import ProcessPlaceholder from "./ProcessPlaceholder";
import DecorateWithLinks from "./DecorateWithLinks";
import { connect } from 'react-redux';

class ConjugateHomework extends Component {
  constructor(props) { 
    super(props)
  }


  render () {
    const { homework, hRefs, addWord } = this.props
    return <div className="hconjugate">
      { homework.map((h,i) =>  {
        return <div className="homework-example"><ProcessPlaceholder homework={h} pref={hRefs[i]} pp={DecorateWithLinks} fn={addWord} /></div>
        })}
    </div>
  }
}

const mapStateToProps = state => ({
  homework: state.conjugsHomework.homework,
  hRefs: state.conjugsHomework.myConjugsRefs,
  words: state.words.words,
});

export default connect(mapStateToProps, { })(ConjugateHomework);
