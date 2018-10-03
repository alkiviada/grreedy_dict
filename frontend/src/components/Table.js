import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpWord, fetchWords, requestWords, requestWord } from '../actions/wordsActions';
import { Link } from "react-router-dom";


class Table extends Component {
  constructor(props) { 
    super(props)
    this.addRow = this.addRow.bind(this) 
    this.myRef = React.createRef();
  }
  static propTypes = {
    data: PropTypes.array.isRequired,
    lookUpWord: PropTypes.func.isRequired,
    fetchWords: PropTypes.func.isRequired,
    requestWords: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('mounting table');
    this.props.requestWords();
    console.log(this.props.uuid)
    this.props.fetchWords(this.props.uuid);
  }

  addRow (e, word) {
    console.log('look up');
    e.preventDefault();
    console.log('checking map');
    if (!this.props.allWordsMap[word]) {
      this.props.requestWord();
      const uuid = this.props.uuid
      this.props.lookUpWord(word, this.props.data, uuid);
    }
    this.scrollToDomRef()
  }

  scrollToDomRef = () => {
    const domNode = ReactDOM.findDOMNode(this.myRef.current)
    window.scrollTo(0, domNode.offsetTop-35)
  }

  render () {
    const data = this.props.data;
    const allFetching = this.props.allFetching;
    const wordFetching = this.props.newWordFetching;
    console.log(allFetching)
    if (allFetching && !data.length) {
      return (
        <div className="words-container">
        <div className="clear-notification-message notification">Loading...</div> 
        </div>
      )
    } 
    const auth = this.props.auth
    return !data.length ? (
      <div className="words-container" ref={this.myRef}>
      <div className="notification clear-notification-message">
      Start new collection
      { !auth.isAuthenticated ? 
          <span> or <Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link></span> : '' }
      </div>
      </div>
    ) : (
    <div className="words-container column is-10" ref={this.myRef}>
    { wordFetching ? <div className="clear-notification-message">Loading...</div> : '' }
      <h2 className="subtitle table-subtitle is-6">
        Showing <strong>{data.length} word{data.length > 1 ? 's' : ''}</strong>
      </h2>
      <table className="table is-striped">
        <thead>
          <tr>
            {Object.entries(data[0]).map((el, i) => <th key={key(el)} className={`th-is-${i}`}>{el[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(el => {
            let word = el.word;
            return (
              <tr key={el.id}>
                { Object.entries(el).map(el => 
                <td><div className="word" key={key(el)}>
                {typeof(el[1]) === 'string' ? 
                el[1] : 
                <WordTabs word={word} element={el[1]} fn={[this.addRow]} />}
                </div></td>) }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uuid: state.collections.uuid,
  data: state.words.items,
  allWordsMap: state.words.allWordsMap,
  allFetching: state.words.allWordsFetching,
  wordFetching: state.words.newWordFetching,
});

export default connect(mapStateToProps, { lookUpWord, fetchWords, requestWords, requestWord })(Table);
