import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchVerbs, requestVerbs } from '../actions/verbsActions';

const mapStateToProps = state => ({
  verbs: state.verbs.verbs,
});

class Verbs extends Component {
  constructor(props) { 
    super(props)

    this.onVerbClick = this.onVerbClick.bind(this) 
  }

  static propTypes = {
    verbs: PropTypes.array.isRequired,
  }

  componentWillMount() {
    console.log('mounting verbs');
    if (!this.props.verbs.length) {
      this.props.requestVerbs();
      this.props.fetchVerbs();
    }
  }

  onVerbClick(e, verb) {
    console.log('verb loading');
  }
  
  render () {
    const { verbs } = this.props;
    console.log('verbs')
    return verbs.length ? (
      <div className="verbs-sidebar">
      <div className="verbs-list">
      <ul className="verbs-ul">
       { verbs.map(v => 
          <li><a href={`/homework/conjugate/${v.word}`} 
          onClick={(e) => this.onVerbClick(e, v.word)} className="verb-link">
            <span className="verb-word">{v.word}</span>
         </a></li>
       )}
      </ul>
     </div>
    </div>
   ) : <div className="verbs-sidebar"><div className="verbs-empty"></div></div>
 }
}

export default connect(mapStateToProps, { requestVerbs, 
                                          fetchVerbs, 
                                          })(Verbs);
