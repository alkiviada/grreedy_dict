import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpWord, fetchWords, requestWords, requestWord } from '../actions/wordsActions';
import { Link } from "react-router-dom";
import BodyClassName from 'react-body-classname';


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
    this.props.fetchWords(this.props.uuid);
  }

  addRow (e, word) {
    console.log('look up');
    e.preventDefault();
    if (!this.props.allWordsMap[word]) {
      this.props.requestWord();
      this.props.lookUpWord(word);
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
    const collFetching = this.props.collFetching;

    const wordFetching = this.props.newWordFetching;
    if (allFetching || collFetching) {
      return (
        <BodyClassName className="body-with-image">
        <div className="words-container">
        <em>Loading...</em> 
        </div>
        </BodyClassName>
      )
    } 
    const auth = this.props.auth
    return !data.length ? (
      <BodyClassName className="body-with-image">
      <div className="words-container" ref={this.myRef}>
      <div className="words-invite">
      Start new collection
      { !auth.isAuthenticated ? 
          <span> or <Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link></span> : '' }
      </div>
      </div>
      </BodyClassName>
    ) : (
    <BodyClassName className={data.length < 6 ? 'body-with-image' : ''}>
    <div className="words-container" ref={this.myRef}>
    { wordFetching ? <em>Loading...</em> : '' }
      <h2 className="coll-title">
        Showing <strong>{data.length} word{data.length > 1 ? 's' : ''}</strong>
      </h2>
      <div className="words-table">
       <div className="words-head">
            {Object.entries(data[0]).map((el, i) => <p>{el[0]}</p>)}
        </div>
        <div className="words-rows">
          {data.map(el => {
            let word = el.word;
            return (
                Object.entries(el).map(el => 
                <div className="word-cell">
                {typeof(el[1]) === 'string' ? 
                <div className="word" key={key(el)}>
                <strong>{el[1]}</strong></div> : 
                <div className="word-about" key={key(el)}>
                <WordTabs word={word} element={el[1]} fn={[this.addRow]} /></div>}
                </div>)
            )
          })}
        </div>
      </div>
    </div>
    </BodyClassName>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uuid: state.collections.uuid,
  data: state.words.items,
  allWordsMap: state.words.allWordsMap,
  allFetching: state.words.allWordsFetching,
  collFetching: state.collections.fetching,
  wordFetching: state.words.newWordFetching,
});

export default connect(mapStateToProps, { lookUpWord, fetchWords, requestWords, requestWord })(Table);
