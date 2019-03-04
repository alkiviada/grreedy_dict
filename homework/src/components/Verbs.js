import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchVerbs, requestVerbs, requestVerb } from '../actions/verbsActions';

const mapStateToProps = state => ({
  verbs: state.verbs.verbs,
  tenseIdx: state.conjugs.tenseIdx,
});

class Verbs extends Component {
  constructor(props) { 
    super(props)

    this.onVerbClick = this.onVerbClick.bind(this) 
  }

  static propTypes = {
    verbs: PropTypes.array.isRequired,
  }

  componentDidMount() {
    console.log('mounting verbs');
    if (!this.props.verbs.length) {
      this.props.requestVerbs();
      this.props.fetchVerbs();
    }
  }

  onVerbClick(e, verb, language) {
    console.log('verb loading');
    console.log(this.props)
    this.props.requestVerb(verb, language) 
    // return <Redirect to="/homework/conjugate/{verb}/{tenseIdx}"
  }
  
  render () {
    const { verbs, tenseIdx } = this.props;
    let seenVerbMap = {}
    console.log('verbs')
    return verbs.length ? (
      <div className="verbs-sidebar">
      <input type="checkbox" id="verbs-toggle" class="verbs-toggle" />
      <div className="verbs-list">
      <ul className="verbs-ul">
       { 
         verbs.map(v => {
          seenVerbMap[v.word] = seenVerbMap[v.word] ? seenVerbMap[v.word]++ : 1;
          return <li><a href={`/homework/conjugate/${v.word}/${v.language}`} data-verb-tool-tip="conjugate"
          onClick={(e) => this.onVerbClick(e, v.word, v.language)} className="verb-link">
            <span className="verb-word">{v.word}</span> 
            { seenVerbMap[v.word] > 1 ? <span className="verb-language">{v.language == 'italian' ? '(it)' : '(fr)'}</span> : '' }
         </a></li>
                 })
       }
      </ul>
     </div>
    <label for="verbs-toggle" class="verbs-toggle-label">
    <span class="verbs-label">Verbs</span>
    </label>
    </div>
   ) : <div className="verbs-sidebar"><div className="verbs-empty"></div></div>
 }
}

export default connect(mapStateToProps, { requestVerbs, 
                                          fetchVerbs, 
                                          requestVerb, 
                                          })(Verbs);
